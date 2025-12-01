const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory state (aligned with old localStorage structure)
// act1: { name, crypto?, s:{good,vs,wrong,val} }
// teams: { name, score, votesFor, votesAgainst, votersFor, votersAgainst, votedFor, votedAgainst }
// votesLog: { ts, from, to, choice:'for'|'against', weight, delta }
const state = {
  act1: [],
  teams: [],
  votesLog: []
};

// Mode Classe - Stockage en mémoire
const classrooms = new Map(); // classCode -> classroom data

// Mode DAO Builder - Stockage en mémoire
const daos = new Map(); // daoCode -> dao data
// Structure DAO:
// {
//   code: string (6 chars),
//   name: string,
//   description: string,
//   createdBy: string (responsable),
//   createdAt: timestamp,
//   tokenName: string,
//   tokenSymbol: string,
//   tokensPerMember: number,
//   quorum: number (percentage 0-100),
//   approvalThreshold: number (percentage 0-100),
//   votingDuration: number (minutes),
//   treasuryBalance: number,
//   members: [{ name, tokens, joinedAt }],
//   proposals: [{
//     id: string,
//     title: string,
//     description: string,
//     type: 'funding' | 'parameter' | 'general',
//     amount: number,
//     proposer: string,
//     createdAt: timestamp,
//     votingEndsAt: timestamp,
//     status: 'active' | 'passed' | 'rejected' | 'executed',
//     votes: { memberName: { vote: 'for'|'against'|'abstain', weight: number } },
//     results: { for: number, against: number, abstain: number, quorumReached: boolean }
//   }],
//   status: 'configuring' | 'active' | 'closed'
// }

// Structure classroom (team mode):
// {
//   code: string (6 chars),
//   name: string,
//   mode: 'team' | 'solo',
//   createdBy: string (responsable name),
//   createdAt: timestamp,
//   participants: [{ name, joinedAt }],
//   groups: [{ id, name, logo, members: [name], validator: name, contractChoice: id, votes: {name: contractId}, score: 0 }],
//   status: 'waiting' | 'voting' | 'validating' | 'completed',
//   selectedContracts: [contractId], // 5 contracts to validate
//   validationResults: { groupId: { isValid, validatorScores: {name: points} } }
// }
//
// Structure classroom (solo mode):
// {
//   code: string (6 chars),
//   name: string,
//   mode: 'solo',
//   createdBy: string (responsable name),
//   createdAt: timestamp,
//   participants: [{ name, joinedAt }],
//   status: 'waiting' | 'playing' | 'dao-voting' | 'completed',
//   playerProgress: {
//     [playerName]: {
//       status: 'contract' | 'mining' | 'voting' | 'completed' | 'eliminated',
//       contractPair: [contractId, contractId],
//       contractChoice: contractId,
//       contractCorrect: boolean,
//       validationScore: number, // Number of bots that validated correctly
//       miningAttempts: number,
//       miningNonce: number,
//       miningTarget: number,
//       miningCompleted: boolean,
//       totalScore: number,
//       eliminatedAt: timestamp,
//       eliminatedReason: string
//     }
//   },
//   daoVotes: { voterName: { targetName: 'for'|'against' } },
//   finalRankings: [{ name, score, votesFor, votesAgainst, finalScore }]
// }

// ---------------- Helpers ----------------

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);
}

function totalAct1(t) {
  const s = t.s || {};
  return (Number(s.good) || 0) * 3 + (Number(s.vs) || 0) * 2 - (Number(s.wrong) || 0) * 2;
}

function eligibleAct1(t) {
  return (Number(t?.s?.val) || 0) >= 2;
}

function findTeam(name) {
  return state.teams.find(t => t.name === name);
}

// revert a single vote log entry on given teams array
function revertVote(entry, teams) {
  const { from, to, choice, weight, delta } = entry;
  const voter = teams.find(t => t.name === from);
  const target = teams.find(t => t.name === to);
  if (!voter || !target) return;

  // revert score
  target.score = Number(target.score || 0) - Number(delta || 0);

  if (choice === 'for') {
    target.votesFor = Math.max(0, (Number(target.votesFor) || 0) - (Number(weight) || 0));
    if (Array.isArray(target.votersFor)) {
      target.votersFor = target.votersFor.filter(n => n !== voter.name);
    }
    if (Array.isArray(voter.votedFor)) {
      voter.votedFor = voter.votedFor.filter(n => n !== target.name);
    }
  } else if (choice === 'against') {
    target.votesAgainst = Math.max(0, (Number(target.votesAgainst) || 0) - (Number(weight) || 0));
    if (Array.isArray(target.votersAgainst)) {
      target.votersAgainst = target.votersAgainst.filter(n => n !== voter.name);
    }
    if (Array.isArray(voter.votedAgainst)) {
      voter.votedAgainst = voter.votedAgainst.filter(n => n !== target.name);
    }
  }
}

// ---------------- Health ----------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Blockchain Simulation Game backend running' });
});

// ---------------- Activity 1 ----------------

// Get all Activity 1 teams
app.get('/api/activity1/teams', (req, res) => {
  res.json(state.act1);
});

// Initialize Activity 1 teams from a teamsSetup-like payload
// body: { teams: [{ name, crypto? }] }
app.post('/api/activity1/init', (req, res) => {
  const { teams } = req.body || {};
  if (!Array.isArray(teams)) {
    return res.status(400).json({ error: 'teams must be array' });
  }
  state.act1 = teams.map(t => ({
    name: String(t.name || '').trim(),
    crypto: t.crypto ? { label: t.crypto.label, img: t.crypto.img } : undefined,
    s: { good: 0, vs: 0, wrong: 0, val: 0 }
  }));
  res.json({ ok: true, act1: state.act1 });
});

// Update a counter for Activity 1
// body: { name, field:"good"|"vs"|"wrong"|"val", delta }
app.post('/api/activity1/bump', (req, res) => {
  const { name, field, delta } = req.body || {};
  const t = state.act1.find(x => x.name === name);
  if (!t) return res.status(404).json({ error: 'team not found' });
  if (!['good', 'vs', 'wrong', 'val'].includes(field)) {
    return res.status(400).json({ error: 'invalid field' });
  }
  const d = Number(delta) || 0;
  const current = Number(t.s[field]) || 0;
  t.s[field] = Math.max(0, current + d);
  res.json({ ok: true, team: t });
});

// Reset Activity 1
app.post('/api/activity1/reset', (req, res) => {
  state.act1 = [];
  res.json({ ok: true });
});

// List eligible teams with totals
app.get('/api/activity1/eligible', (req, res) => {
  const elig = state.act1.filter(eligibleAct1);
  const mapped = elig.map(t => ({
    name: t.name,
    validators: Number(t.s.val) || 0,
    total: totalAct1(t)
  }));
  res.json(mapped);
});

// ---------------- Minting ----------------

// body: { statuses: { [teamName]: 'first'|'second'|'others'|'fail' } }
app.post('/api/mint/apply', (req, res) => {
  const { statuses } = req.body || {};
  if (!statuses || typeof statuses !== 'object') {
    return res.status(400).json({ error: 'statuses required' });
  }

  const elig = state.act1.filter(eligibleAct1);
  if (!elig.length) {
    return res.status(400).json({ error: 'no eligible teams' });
  }

  const chosen = Object.entries(statuses);
  const firsts = chosen.filter(([, v]) => v === 'first');
  const seconds = chosen.filter(([, v]) => v === 'second');
  if (firsts.length > 1 || seconds.length > 1) {
    return res.status(400).json({ error: 'only one first and one second allowed' });
  }

  const bonusFor = (name) => {
    const st = statuses[name] || 'others';
    if (st === 'first') return 10;
    if (st === 'second') return 5;
    if (st === 'others') return 1;
    return 0;
  };

  state.teams = elig.map(t => ({
    name: t.name,
    score: totalAct1(t) + bonusFor(t.name),
    votesFor: 0,
    votesAgainst: 0,
    votersFor: [],
    votersAgainst: [],
    votedFor: [],
    votedAgainst: []
  }));

  res.json({ ok: true, teams: state.teams });
});

// ---------------- Teams (Activity 2) ----------------

app.get('/api/teams', (req, res) => {
  res.json(state.teams);
});

// For debugging/demo: reset teams & votes
app.post('/api/teams/reset', (req, res) => {
  state.teams = [];
  state.votesLog = [];
  res.json({ ok: true });
});

// ---------------- Voting ----------------

// Get votes log
app.get('/api/votes/log', (req, res) => {
  res.json(state.votesLog);
});

// Submit votes from one voter
// body: { voterName, choices: { [targetName]: 'for'|'against' } }
app.post('/api/votes/submit', (req, res) => {
  const { voterName, choices } = req.body || {};
  if (!voterName || !choices || typeof choices !== 'object') {
    return res.status(400).json({ error: 'voterName and choices required' });
  }
  const teams = state.teams;
  const voter = teams.find(t => t.name === voterName);
  if (!voter) return res.status(404).json({ error: 'voter not found' });

  const weight = Number(voter.score) || 0;
  Object.keys(choices).forEach(targetName => {
    const choice = choices[targetName];
    const target = teams.find(t => t.name === targetName);
    if (!target) return;
    if (target.name === voter.name) return; // no self-vote

    let delta = 0;
    if (choice === 'for') {
      delta = 3 * weight;
      target.votesFor = (Number(target.votesFor) || 0) + weight;
      target.votersFor = target.votersFor || [];
      if (!target.votersFor.includes(voter.name)) target.votersFor.push(voter.name);
      voter.votedFor = voter.votedFor || [];
      if (!voter.votedFor.includes(target.name)) voter.votedFor.push(target.name);
    } else if (choice === 'against') {
      delta = -1 * weight;
      target.votesAgainst = (Number(target.votesAgainst) || 0) + weight;
      target.votersAgainst = target.votersAgainst || [];
      if (!target.votersAgainst.includes(voter.name)) target.votersAgainst.push(voter.name);
      voter.votedAgainst = voter.votedAgainst || [];
      if (!voter.votedAgainst.includes(target.name)) voter.votedAgainst.push(target.name);
    } else {
      return;
    }

    target.score = Number(target.score || 0) + delta;
    const entry = { ts: Date.now(), from: voter.name, to: target.name, choice, weight, delta };
    state.votesLog.unshift(entry);
  });

  res.json({ ok: true, teams, votesLog: state.votesLog });
});

// Delete a vote at index and revert effects
// body: { index }
app.post('/api/votes/deleteOne', (req, res) => {
  const { index } = req.body || {};
  const idx = Number(index);
  if (Number.isNaN(idx) || idx < 0 || idx >= state.votesLog.length) {
    return res.status(400).json({ error: 'invalid index' });
  }
  const entry = state.votesLog[idx];
  revertVote(entry, state.teams);
  state.votesLog.splice(idx, 1);
  res.json({ ok: true, teams: state.teams, votesLog: state.votesLog });
});

// Delete all votes and revert effects
app.post('/api/votes/clear', (req, res) => {
  const log = state.votesLog.slice();
  for (let i = log.length - 1; i >= 0; i -= 1) {
    revertVote(log[i], state.teams);
  }
  state.votesLog = [];
  res.json({ ok: true, teams: state.teams, votesLog: state.votesLog });
});

// Reset only votes aggregates, keep scores
app.post('/api/votes/resetAggregates', (req, res) => {
  state.teams.forEach(t => {
    t.votesFor = 0;
    t.votesAgainst = 0;
    t.votersFor = [];
    t.votersAgainst = [];
    t.votedFor = [];
    t.votedAgainst = [];
  });
  res.json({ ok: true, teams: state.teams });
});

// ---------------- Results ----------------

// Compute final results with +5/-5 bonus/malus
app.post('/api/results/compute', (req, res) => {
  const teams = state.teams;
  if (!teams.length) return res.status(400).json({ error: 'no teams' });

  let mostFor = null;
  let mostAgainst = null;
  teams.forEach(t => {
    if (!mostFor || (Number(t.votesFor) || 0) > (Number(mostFor.votesFor) || 0)) mostFor = t;
    if (!mostAgainst || (Number(t.votesAgainst) || 0) > (Number(mostAgainst.votesAgainst) || 0)) mostAgainst = t;
  });

  const adjustments = {};
  if (mostFor) {
    adjustments[mostFor.name] = (adjustments[mostFor.name] || 0) + 5;
  }
  if (mostAgainst) {
    adjustments[mostAgainst.name] = (adjustments[mostAgainst.name] || 0) - 5;
  }

  teams.forEach(t => {
    const adj = adjustments[t.name] || 0;
    t.score = Number(t.score || 0) + adj;
  });

  const finalSnapshot = teams.slice().sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
  res.json({ ok: true, final: finalSnapshot, adjustments });
});

// ---------------- Solo mode (single-player with bot validators) ----------------

// Importer la base de 100 smart contracts
const { SMART_CONTRACTS } = require('./smartContracts');

// Tracking des contrats déjà utilisés pour éviter les répétitions
// Structure: { sessionId: [contractIds...] }
const usedContracts = {};

// Générer un ID de session simple basé sur le timestamp
function getSessionId() {
  return `session_${Date.now()}`;
}

// Nettoyer les anciennes sessions (> 24h)
function cleanOldSessions() {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  Object.keys(usedContracts).forEach(sessionId => {
    const timestamp = parseInt(sessionId.split('_')[1]);
    if (now - timestamp > DAY_MS) {
      delete usedContracts[sessionId];
    }
  });
}

function pickSoloPair() {
  cleanOldSessions();

  const valids = SMART_CONTRACTS.filter(c => c.isValid);
  const invalids = SMART_CONTRACTS.filter(c => !c.isValid);

  if (!valids.length || !invalids.length) return null;

  // Pour cette implémentation, on ne track pas encore par session
  // On pioche simplement aléatoirement parmi tous les contrats
  const valid = valids[Math.floor(Math.random() * valids.length)];
  const invalid = invalids[Math.floor(Math.random() * invalids.length)];

  const pair = [valid, invalid].map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    code: c.code
  }));

  // Ordre aléatoire (parfois valid en premier, parfois invalid)
  pair.sort(() => Math.random() - 0.5);
  return pair;
}

// Get a pair of contracts (one valid, one invalid) for solo mode
app.get('/api/solo/contracts/pair', (req, res) => {
  const pair = pickSoloPair();
  if (!pair) return res.status(500).json({ error: 'No contracts available' });
  res.json({ contracts: pair, total: pair.length });
});

// Submit the player choice; simulate 8 validators as bots
// body: { playerName?, chosenId }
app.post('/api/solo/contracts/answer', (req, res) => {
  const { playerName, chosenId } = req.body || {};
  if (!chosenId) return res.status(400).json({ error: 'chosenId required' });
  const contract = SMART_CONTRACTS.find(c => c.id === chosenId);
  if (!contract) return res.status(404).json({ error: 'contract not found' });

  const effectivePlayerName = String(playerName || 'Joueur Solo').trim() || 'Joueur Solo';

  const isValidContract = !!contract.isValid;
  const totalValidators = 8;
  const probValid = isValidContract ? 0.8 : 0.2; // simple heuristic: bots sont plus souvent corrects
  let validVotes = 0;
  for (let i = 0; i < totalValidators; i += 1) {
    if (Math.random() < probValid) validVotes += 1;
  }
  const canMint = isValidContract && validVotes >= 2;

  // Ensure player exists in Activity 1 state and update statistics
  let team = state.act1.find(t => t.name === effectivePlayerName);
  if (!team) {
    team = { name: effectivePlayerName, s: { good: 0, vs: 0, wrong: 0, val: 0 } };
    state.act1.push(team);
  }
  if (isValidContract) {
    team.s.good = (Number(team.s.good) || 0) + 1;
  } else {
    team.s.wrong = (Number(team.s.wrong) || 0) + 1;
  }
  team.s.val = (Number(team.s.val) || 0) + validVotes;

  res.json({
    ok: true,
    correct: isValidContract,
    isValidContract,
    validVotes,
    totalValidators,
    canMint,
    explanation: contract.explanation,
    contract: {
      id: contract.id,
      title: contract.title,
      description: contract.description,
      code: contract.code
    },
    player: team
  });
});

// ================ MODE CLASSE API ================

// Helper: Generate random 6-character code
function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans I, O, 0, 1 pour éviter confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Helper: Generate unique code
function generateUniqueClassCode() {
  let code;
  do {
    code = generateClassCode();
  } while (classrooms.has(code));
  return code;
}

// Helper: Form groups automatically (4 per group)
function formGroups(participants) {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  const groups = [];
  const groupSize = 4;
  const numGroups = Math.floor(shuffled.length / groupSize);

  const logos = ['🦁', '🐯', '🐻', '🦅', '🐺', '🐉', '🦈', '🦊', '🐆', '🦌'];
  const groupNames = ['Lions', 'Tigres', 'Ours', 'Aigles', 'Loups', 'Dragons', 'Requins', 'Renards', 'Guépards', 'Cerfs'];

  for (let i = 0; i < numGroups; i++) {
    const members = shuffled.slice(i * groupSize, (i + 1) * groupSize);
    const validator = members[3]; // Le 4ème membre est le validateur
    const voters = members.slice(0, 3); // Les 3 premiers votent

    groups.push({
      id: `group_${i + 1}`,
      name: groupNames[i] || `Groupe ${i + 1}`,
      logo: logos[i] || '⭐',
      members: voters.map(p => p.name),
      validator: validator.name,
      votes: {}, // { memberName: contractId }
      contractChoice: null,
      score: 0
    });
  }

  return groups;
}

// POST /api/class/create - Créer une nouvelle classe
app.post('/api/class/create', (req, res) => {
  const { className, responsableName, mode } = req.body; // mode: 'team' ou 'solo'

  if (!className || !responsableName) {
    return res.status(400).json({ error: 'Nom de classe et nom du responsable requis' });
  }

  const classMode = mode === 'solo' ? 'solo' : 'team'; // Par défaut 'team'
  const code = generateUniqueClassCode();

  const classroom = {
    code,
    name: className,
    mode: classMode,
    createdBy: responsableName,
    createdAt: Date.now(),
    participants: [],
    status: 'waiting'
  };

  // Ajouter les champs spécifiques au mode
  if (classMode === 'team') {
    classroom.groups = [];
    classroom.selectedContracts = [];
    classroom.validationResults = {};
  } else {
    classroom.playerProgress = {};
  }

  classrooms.set(code, classroom);

  res.json({
    ok: true,
    code,
    classroom
  });
});

// POST /api/class/join - Rejoindre une classe avec un code
app.post('/api/class/join', (req, res) => {
  const { classCode, participantName } = req.body;

  if (!classCode || !participantName) {
    return res.status(400).json({ error: 'Code de classe et nom du participant requis' });
  }

  const classroom = classrooms.get(classCode.toUpperCase());

  if (!classroom) {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  if (classroom.status !== 'waiting') {
    return res.status(400).json({ error: 'La classe a déjà commencé' });
  }

  // Vérifier si le nom existe déjà
  if (classroom.participants.some(p => p.name === participantName)) {
    return res.status(400).json({ error: 'Ce nom est déjà pris' });
  }

  classroom.participants.push({
    name: participantName,
    joinedAt: Date.now()
  });

  res.json({
    ok: true,
    classroom
  });
});

// GET /api/class/:code - Obtenir les infos d'une classe
app.get('/api/class/:code', (req, res) => {
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom) {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  res.json({ ok: true, classroom });
});

// POST /api/class/:code/start - Démarrer la classe et former les groupes
app.post('/api/class/:code/start', (req, res) => {
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom) {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  if (classroom.participants.length < 4) {
    return res.status(400).json({ error: 'Minimum 4 participants requis' });
  }

  // Former les groupes automatiquement
  classroom.groups = formGroups(classroom.participants);
  classroom.status = 'voting';

  // Sélectionner 5 smart contracts aléatoires (1 par groupe, mais variant)
  const { SMART_CONTRACTS } = require('./smartContracts');
  const valids = SMART_CONTRACTS.filter(c => c.isValid);
  const invalids = SMART_CONTRACTS.filter(c => !c.isValid);

  classroom.selectedContracts = [];
  for (let i = 0; i < classroom.groups.length; i++) {
    const useValid = Math.random() > 0.5;
    const pool = useValid ? valids : invalids;
    const contract = pool[Math.floor(Math.random() * pool.length)];
    classroom.selectedContracts.push(contract.id);
  }

  res.json({
    ok: true,
    classroom
  });
});

// POST /api/class/:code/vote - Vote d'un membre pour un smart contract
app.post('/api/class/:code/vote', (req, res) => {
  const { memberName, contractId } = req.body;
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom) {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  // Trouver le groupe du membre
  const group = classroom.groups.find(g => g.members.includes(memberName));

  if (!group) {
    return res.status(400).json({ error: 'Membre non trouvé dans un groupe votant' });
  }

  // Enregistrer le vote
  group.votes[memberName] = contractId;

  // Vérifier si tous les membres ont voté
  const allVoted = group.members.every(m => group.votes[m]);

  if (allVoted) {
    // Compter les votes et choisir le contrat majoritaire
    const voteCounts = {};
    Object.values(group.votes).forEach(cId => {
      voteCounts[cId] = (voteCounts[cId] || 0) + 1;
    });

    const winner = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0][0];
    group.contractChoice = winner;
  }

  // Vérifier si tous les groupes ont terminé de voter
  const allGroupsVoted = classroom.groups.every(g => g.contractChoice !== null);

  if (allGroupsVoted) {
    classroom.status = 'validating';
  }

  res.json({
    ok: true,
    classroom
  });
});

// POST /api/class/:code/validate - Validation par un validateur
app.post('/api/class/:code/validate', (req, res) => {
  const { validatorName, groupId, isValid } = req.body;
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom) {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  const { SMART_CONTRACTS } = require('./smartContracts');
  const group = classroom.groups.find(g => g.id === groupId);

  if (!group) {
    return res.status(400).json({ error: 'Groupe non trouvé' });
  }

  const contract = SMART_CONTRACTS.find(c => c.id === group.contractChoice);
  const correctValidation = contract.isValid === isValid;

  // Initialiser les résultats de validation si nécessaire
  if (!classroom.validationResults[groupId]) {
    classroom.validationResults[groupId] = {
      validations: {},
      validatorScores: {}
    };
  }

  // Enregistrer la validation
  classroom.validationResults[groupId].validations[validatorName] = {
    isValid,
    correct: correctValidation,
    timestamp: Date.now()
  };

  // Calculer les points pour le validateur
  if (correctValidation) {
    classroom.validationResults[groupId].validatorScores[validatorName] = 5; // +5 pour bonne validation
  } else {
    classroom.validationResults[groupId].validatorScores[validatorName] = -3; // -3 pour mauvaise validation
  }

  // Vérifier si toutes les validations sont complètes
  const totalValidations = Object.keys(classroom.validationResults).reduce((sum, gId) => {
    return sum + Object.keys(classroom.validationResults[gId].validations).length;
  }, 0);

  if (totalValidations === classroom.groups.length * classroom.groups.length) {
    // Calculer les scores finaux des groupes
    classroom.groups.forEach(g => {
      const contract = SMART_CONTRACTS.find(c => c.id === g.contractChoice);
      if (contract && contract.isValid) {
        g.score += 10; // +10 pour avoir choisi un bon contrat
      }
    });

    // Sélectionner les équipes qualifiées pour le mining (top 20% ou min 1 équipe)
    const sortedGroups = [...classroom.groups].sort((a, b) => b.score - a.score);
    const qualifiedCount = Math.max(1, Math.ceil(classroom.groups.length * 0.2));
    const qualifiedGroupIds = sortedGroups.slice(0, qualifiedCount).map(g => g.id);

    // Générer un nonce cible pour le mining (0-100)
    const targetNonce = Math.floor(Math.random() * 101);

    classroom.qualifiedGroups = qualifiedGroupIds;
    classroom.miningTarget = targetNonce;
    classroom.miningResults = {}; // { groupId: { solved, solvedBy, solvedAt, attempts: {memberName: count} } }
    classroom.status = 'mining';
  }

  res.json({
    ok: true,
    classroom,
    correct: correctValidation,
    points: correctValidation ? 5 : -3
  });
});

// POST /api/class/:code/mine - Tentative de mining par un membre
app.post('/api/class/:code/mine', (req, res) => {
  const { memberName, nonce } = req.body;
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom) {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  if (classroom.status !== 'mining') {
    return res.status(400).json({ error: 'Phase de mining non active' });
  }

  // Trouver le groupe du membre
  const group = classroom.groups.find(g =>
    g.members.includes(memberName) || g.validator === memberName
  );

  if (!group) {
    return res.status(400).json({ error: 'Membre non trouvé dans un groupe' });
  }

  // Vérifier si le groupe est qualifié
  if (!classroom.qualifiedGroups.includes(group.id)) {
    return res.status(400).json({ error: 'Votre équipe n\'est pas qualifiée pour le mining' });
  }

  // Initialiser les résultats de mining pour ce groupe si nécessaire
  if (!classroom.miningResults[group.id]) {
    classroom.miningResults[group.id] = {
      solved: false,
      solvedBy: null,
      solvedAt: null,
      attempts: {}
    };
  }

  const groupResult = classroom.miningResults[group.id];

  // Vérifier si le groupe a déjà trouvé
  if (groupResult.solved) {
    return res.json({
      ok: true,
      alreadySolved: true,
      solvedBy: groupResult.solvedBy,
      classroom
    });
  }

  // Initialiser le compteur de tentatives pour ce membre
  if (!groupResult.attempts[memberName]) {
    groupResult.attempts[memberName] = 0;
  }

  // Vérifier si le membre a atteint ses 10 tentatives
  if (groupResult.attempts[memberName] >= 10) {
    return res.status(400).json({ error: 'Vous avez épuisé vos 10 tentatives' });
  }

  // Incrémenter le compteur
  groupResult.attempts[memberName]++;

  // Vérifier si le nonce est correct
  const correct = parseInt(nonce) === classroom.miningTarget;

  if (correct) {
    groupResult.solved = true;
    groupResult.solvedBy = memberName;
    groupResult.solvedAt = Date.now();

    // Calculer le rang (nombre d'équipes qui ont déjà résolu)
    const solvedCount = Object.values(classroom.miningResults).filter(r => r.solved).length;

    // Attribution des points selon le rang
    let points = 0;
    if (solvedCount === 1) points = 30; // 1ère équipe
    else if (solvedCount === 2) points = 20; // 2ème équipe
    else if (solvedCount === 3) points = 15; // 3ème équipe
    else if (solvedCount === 4) points = 10; // 4ème équipe
    else points = 5; // Autres

    group.score += points;
    group.miningPoints = points;
  }

  // Vérifier si toutes les équipes qualifiées ont terminé (trouvé ou épuisé tentatives)
  const allQualifiedFinished = classroom.qualifiedGroups.every(gId => {
    const result = classroom.miningResults[gId];
    if (!result) return false;
    if (result.solved) return true;

    // Vérifier si toutes les tentatives sont épuisées
    const grp = classroom.groups.find(g => g.id === gId);
    const allMembers = [...grp.members, grp.validator];
    const totalAttempts = allMembers.reduce((sum, m) => sum + (result.attempts[m] || 0), 0);
    const maxAttempts = allMembers.length * 10;

    return totalAttempts >= maxAttempts;
  });

  if (allQualifiedFinished) {
    // Sélectionner les 2 meilleures équipes pour le vote DAO final
    const rankedGroups = [...classroom.groups].sort((a, b) => b.score - a.score);
    const top2Groups = rankedGroups.slice(0, 2);
    const top2GroupIds = top2Groups.map(g => g.id);

    // Calculer les points individuels pour chaque membre des 2 meilleures équipes
    classroom.individualScores = {};
    top2Groups.forEach(group => {
      const allMembers = [...group.members, group.validator];
      allMembers.forEach(member => {
        // Points de base de l'équipe divisés par le nombre de membres
        let memberPoints = Math.floor(group.score / allMembers.length);

        // Bonus si le membre a trouvé le nonce
        const miningResult = classroom.miningResults?.[group.id];
        if (miningResult?.solvedBy === member) {
          memberPoints += 10; // Bonus pour avoir trouvé le nonce
        }

        classroom.individualScores[member] = memberPoints;
      });
    });

    classroom.top2Groups = top2GroupIds;
    classroom.daoVotes = {}; // { voterName: { targetName: 'for'|'against' } }
    classroom.status = 'dao';
  }

  res.json({
    ok: true,
    correct,
    attempts: groupResult.attempts[memberName],
    maxAttempts: 10,
    solved: groupResult.solved,
    solvedBy: groupResult.solvedBy,
    points: correct ? (group.miningPoints || 0) : 0,
    classroom
  });
});

// POST /api/class/:code/dao-vote - Vote DAO individuel
app.post('/api/class/:code/dao-vote', (req, res) => {
  const { voterName, targetName, voteType } = req.body;
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom) {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  if (classroom.status !== 'dao') {
    return res.status(400).json({ error: 'Phase de vote DAO non active' });
  }

  // Vérifier que le votant fait partie des 2 meilleures équipes
  const voterGroup = classroom.groups.find(g =>
    g.members.includes(voterName) || g.validator === voterName
  );

  if (!voterGroup || !classroom.top2Groups.includes(voterGroup.id)) {
    return res.status(400).json({ error: 'Vous ne faites pas partie des équipes qualifiées pour le vote' });
  }

  // Vérifier que la cible fait partie des 2 meilleures équipes et n'est pas le votant
  const targetGroup = classroom.groups.find(g =>
    g.members.includes(targetName) || g.validator === targetName
  );

  if (!targetGroup || !classroom.top2Groups.includes(targetGroup.id)) {
    return res.status(400).json({ error: 'Cible non valide' });
  }

  if (voterName === targetName) {
    return res.status(400).json({ error: 'Vous ne pouvez pas voter pour vous-même' });
  }

  // Initialiser les votes du votant
  if (!classroom.daoVotes[voterName]) {
    classroom.daoVotes[voterName] = {};
  }

  // Enregistrer le vote
  classroom.daoVotes[voterName][targetName] = voteType;

  // Récupérer tous les participants des 2 meilleures équipes
  const allQualifiedMembers = [];
  classroom.top2Groups.forEach(gId => {
    const group = classroom.groups.find(g => g.id === gId);
    allQualifiedMembers.push(...group.members, group.validator);
  });

  // Vérifier si tous les membres ont voté pour tous les autres
  const allVoted = allQualifiedMembers.every(voter => {
    const voterVotes = classroom.daoVotes[voter] || {};
    const expectedVotes = allQualifiedMembers.filter(m => m !== voter).length;
    return Object.keys(voterVotes).length === expectedVotes;
  });

  if (allVoted) {
    // Calculer les scores finaux avec les votes pondérés
    classroom.finalScores = {};

    allQualifiedMembers.forEach(member => {
      let finalScore = classroom.individualScores[member] || 0;

      // Appliquer les votes reçus
      allQualifiedMembers.forEach(voter => {
        if (voter !== member && classroom.daoVotes[voter]?.[member]) {
          const voterScore = classroom.individualScores[voter] || 0;
          const weight = Math.floor(voterScore / 10);
          const voteType = classroom.daoVotes[voter][member];

          if (voteType === 'for') {
            finalScore += weight * 3; // Vote pour = +3 × poids
          } else if (voteType === 'against') {
            finalScore -= weight; // Vote contre = -1 × poids
          }
        }
      });

      classroom.finalScores[member] = finalScore;
    });

    // Créer le classement final
    const rankings = allQualifiedMembers.map(member => ({
      name: member,
      initialScore: classroom.individualScores[member] || 0,
      votesFor: allQualifiedMembers.filter(v => classroom.daoVotes[v]?.[member] === 'for').length,
      votesAgainst: allQualifiedMembers.filter(v => classroom.daoVotes[v]?.[member] === 'against').length,
      finalScore: classroom.finalScores[member]
    })).sort((a, b) => b.finalScore - a.finalScore);

    classroom.finalRankings = rankings;
    classroom.status = 'completed';
  }

  res.json({
    ok: true,
    classroom
  });
});

// ================ MODE SOLO EN CLASSE API ================

// POST /api/class/:code/solo/start - Démarrer le jeu pour un joueur en mode solo
app.post('/api/class/:code/solo/start', (req, res) => {
  const { playerName } = req.body;
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom) {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  if (classroom.mode !== 'solo') {
    return res.status(400).json({ error: 'Cette classe n\'est pas en mode solo' });
  }

  // Vérifier que le joueur a rejoint
  if (!classroom.participants.some(p => p.name === playerName)) {
    return res.status(400).json({ error: 'Joueur non inscrit dans cette classe' });
  }

  // Initialiser le progrès du joueur s'il n'existe pas
  if (!classroom.playerProgress[playerName]) {
    // Générer une paire de contrats
    const pair = pickSoloPair();
    if (!pair) {
      return res.status(500).json({ error: 'Impossible de générer des contrats' });
    }

    classroom.playerProgress[playerName] = {
      status: 'contract',
      contractPair: pair.map(c => c.id),
      contractChoice: null,
      contractCorrect: false,
      validationScore: 0,
      miningAttempts: 0,
      miningNonce: null,
      miningTarget: Math.floor(Math.random() * 21), // 0-20 comme en solo classique
      miningCompleted: false,
      totalScore: 0,
      eliminatedAt: null,
      eliminatedReason: null
    };

    // Passer la classe en mode 'playing' si c'est le premier joueur
    if (classroom.status === 'waiting') {
      classroom.status = 'playing';
    }
  }

  const progress = classroom.playerProgress[playerName];
  const contracts = progress.contractPair.map(id => {
    const c = SMART_CONTRACTS.find(ct => ct.id === id);
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      code: c.code
    };
  });

  res.json({
    ok: true,
    classroom,
    progress,
    contracts
  });
});

// POST /api/class/:code/solo/choose-contract - Choisir un smart contract
app.post('/api/class/:code/solo/choose-contract', (req, res) => {
  const { playerName, contractId } = req.body;
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom || classroom.mode !== 'solo') {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  const progress = classroom.playerProgress[playerName];
  if (!progress) {
    return res.status(400).json({ error: 'Joueur non initialisé' });
  }

  if (progress.status !== 'contract') {
    return res.status(400).json({ error: 'Vous avez déjà choisi un contrat' });
  }

  const contract = SMART_CONTRACTS.find(c => c.id === contractId);
  if (!contract) {
    return res.status(404).json({ error: 'Contrat non trouvé' });
  }

  // Simuler la validation par 8 bots
  const isValidContract = !!contract.isValid;
  const totalValidators = 8;
  const probValid = isValidContract ? 0.8 : 0.2;
  let validVotes = 0;
  for (let i = 0; i < totalValidators; i++) {
    if (Math.random() < probValid) validVotes++;
  }

  progress.contractChoice = contractId;
  progress.contractCorrect = isValidContract;
  progress.validationScore = validVotes;

  // Vérifier si le joueur passe (min 2 validateurs)
  if (validVotes >= 2) {
    // Le joueur passe au mining
    progress.status = 'mining';
    if (isValidContract) {
      progress.totalScore += 10; // Bonus pour bon choix
    }
  } else {
    // Le joueur est éliminé
    progress.status = 'eliminated';
    progress.eliminatedAt = Date.now();
    progress.eliminatedReason = 'Moins de 2 validateurs ont approuvé votre choix';
  }

  res.json({
    ok: true,
    classroom,
    progress,
    correct: isValidContract,
    validVotes,
    totalValidators,
    passed: validVotes >= 2,
    explanation: contract.explanation
  });
});

// POST /api/class/:code/solo/mine - Tentative de mining
app.post('/api/class/:code/solo/mine', (req, res) => {
  const { playerName, nonce } = req.body;
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom || classroom.mode !== 'solo') {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  const progress = classroom.playerProgress[playerName];
  if (!progress) {
    return res.status(400).json({ error: 'Joueur non initialisé' });
  }

  if (progress.status !== 'mining') {
    return res.status(400).json({ error: 'Vous n\'êtes pas en phase de mining' });
  }

  if (progress.miningCompleted) {
    return res.status(400).json({ error: 'Vous avez déjà terminé le mining' });
  }

  if (progress.miningAttempts >= 10) {
    // Éliminer le joueur
    progress.status = 'eliminated';
    progress.eliminatedAt = Date.now();
    progress.eliminatedReason = 'Toutes les tentatives de mining épuisées';
    return res.json({
      ok: true,
      eliminated: true,
      classroom,
      progress
    });
  }

  progress.miningAttempts++;
  const correct = parseInt(nonce) === progress.miningTarget;

  if (correct) {
    progress.miningNonce = parseInt(nonce);
    progress.miningCompleted = true;
    progress.status = 'completed';

    // Points selon le nombre de tentatives
    let miningPoints = 0;
    if (progress.miningAttempts <= 3) miningPoints = 20;
    else if (progress.miningAttempts <= 6) miningPoints = 10;
    else miningPoints = 5;

    progress.totalScore += miningPoints;
  }

  res.json({
    ok: true,
    correct,
    attempts: progress.miningAttempts,
    maxAttempts: 10,
    completed: progress.miningCompleted,
    classroom,
    progress
  });
});

// POST /api/class/:code/solo/start-dao - Démarrer le vote DAO final
app.post('/api/class/:code/solo/start-dao', (req, res) => {
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom || classroom.mode !== 'solo') {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  // Récupérer tous les joueurs qui ont terminé (status = 'completed')
  const completedPlayers = Object.keys(classroom.playerProgress).filter(name =>
    classroom.playerProgress[name].status === 'completed'
  );

  if (completedPlayers.length < 2) {
    return res.status(400).json({ error: 'Pas assez de joueurs ont terminé pour le vote DAO' });
  }

  classroom.status = 'dao-voting';
  classroom.daoVotes = {};

  res.json({
    ok: true,
    classroom,
    completedPlayers
  });
});

// POST /api/class/:code/solo/dao-vote - Vote DAO individuel en mode solo
app.post('/api/class/:code/solo/dao-vote', (req, res) => {
  const { voterName, targetName, voteType } = req.body;
  const classroom = classrooms.get(req.params.code.toUpperCase());

  if (!classroom || classroom.mode !== 'solo') {
    return res.status(404).json({ error: 'Classe non trouvée' });
  }

  if (classroom.status !== 'dao-voting') {
    return res.status(400).json({ error: 'Vote DAO non actif' });
  }

  // Vérifier que le votant a terminé
  const voterProgress = classroom.playerProgress[voterName];
  if (!voterProgress || voterProgress.status !== 'completed') {
    return res.status(400).json({ error: 'Vous n\'avez pas terminé le challenge' });
  }

  // Vérifier que la cible a terminé
  const targetProgress = classroom.playerProgress[targetName];
  if (!targetProgress || targetProgress.status !== 'completed') {
    return res.status(400).json({ error: 'Cible non valide' });
  }

  if (voterName === targetName) {
    return res.status(400).json({ error: 'Vous ne pouvez pas voter pour vous-même' });
  }

  // Initialiser les votes du votant
  if (!classroom.daoVotes[voterName]) {
    classroom.daoVotes[voterName] = {};
  }

  // Enregistrer le vote
  classroom.daoVotes[voterName][targetName] = voteType;

  // Récupérer tous les joueurs qui ont terminé
  const completedPlayers = Object.keys(classroom.playerProgress).filter(name =>
    classroom.playerProgress[name].status === 'completed'
  );

  // Vérifier si tous ont voté pour tous les autres
  const allVoted = completedPlayers.every(voter => {
    const voterVotes = classroom.daoVotes[voter] || {};
    const expectedVotes = completedPlayers.filter(p => p !== voter).length;
    return Object.keys(voterVotes).length === expectedVotes;
  });

  if (allVoted) {
    // Calculer les scores finaux
    classroom.finalScores = {};

    completedPlayers.forEach(player => {
      let finalScore = classroom.playerProgress[player].totalScore;

      // Appliquer les votes reçus
      completedPlayers.forEach(voter => {
        if (voter !== player && classroom.daoVotes[voter]?.[player]) {
          const voterScore = classroom.playerProgress[voter].totalScore;
          const weight = Math.floor(voterScore / 10);
          const voteType = classroom.daoVotes[voter][player];

          if (voteType === 'for') {
            finalScore += weight * 3;
          } else if (voteType === 'against') {
            finalScore -= weight;
          }
        }
      });

      classroom.finalScores[player] = finalScore;
    });

    // Créer le classement final
    const rankings = completedPlayers.map(player => ({
      name: player,
      initialScore: classroom.playerProgress[player].totalScore,
      votesFor: completedPlayers.filter(v => classroom.daoVotes[v]?.[player] === 'for').length,
      votesAgainst: completedPlayers.filter(v => classroom.daoVotes[v]?.[player] === 'against').length,
      finalScore: classroom.finalScores[player]
    })).sort((a, b) => b.finalScore - a.finalScore);

    classroom.finalRankings = rankings;
    classroom.status = 'completed';
  }

  res.json({
    ok: true,
    classroom
  });
});

// ================ MODE DAO BUILDER API ================

// POST /api/dao/create - Créer un nouveau DAO
app.post('/api/dao/create', (req, res) => {
  const {
    daoName,
    description,
    responsableName,
    tokenName,
    tokenSymbol,
    tokensPerMember,
    quorum,
    approvalThreshold,
    votingDuration,
    treasuryBalance
  } = req.body;

  if (!daoName || !responsableName || !tokenName || !tokenSymbol) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const code = generateUniqueClassCode();

  const dao = {
    code,
    name: daoName,
    description: description || '',
    createdBy: responsableName,
    createdAt: Date.now(),
    tokenName,
    tokenSymbol,
    tokensPerMember: tokensPerMember || 100,
    quorum: quorum || 50,
    approvalThreshold: approvalThreshold || 51,
    votingDuration: votingDuration || 60, // minutes
    treasuryBalance: treasuryBalance || 10000,
    members: [],
    proposals: [],
    status: 'configuring'
  };

  daos.set(code, dao);

  res.json({
    ok: true,
    code,
    dao
  });
});

// GET /api/dao/:code - Obtenir les infos d'un DAO
app.get('/api/dao/:code', (req, res) => {
  const dao = daos.get(req.params.code.toUpperCase());

  if (!dao) {
    return res.status(404).json({ error: 'DAO non trouvé' });
  }

  res.json({ ok: true, dao });
});

// POST /api/dao/:code/join - Rejoindre un DAO
app.post('/api/dao/:code/join', (req, res) => {
  const { memberName } = req.body;
  const dao = daos.get(req.params.code.toUpperCase());

  if (!dao) {
    return res.status(404).json({ error: 'DAO non trouvé' });
  }

  if (dao.status !== 'configuring' && dao.status !== 'active') {
    return res.status(400).json({ error: 'Le DAO n\'accepte plus de nouveaux membres' });
  }

  // Vérifier si le nom existe déjà
  if (dao.members.some(m => m.name === memberName)) {
    return res.status(400).json({ error: 'Ce nom est déjà pris' });
  }

  dao.members.push({
    name: memberName,
    tokens: dao.tokensPerMember,
    joinedAt: Date.now()
  });

  res.json({
    ok: true,
    dao
  });
});

// POST /api/dao/:code/activate - Activer le DAO (passer de 'configuring' à 'active')
app.post('/api/dao/:code/activate', (req, res) => {
  const dao = daos.get(req.params.code.toUpperCase());

  if (!dao) {
    return res.status(404).json({ error: 'DAO non trouvé' });
  }

  if (dao.members.length < 2) {
    return res.status(400).json({ error: 'Minimum 2 membres requis pour activer le DAO' });
  }

  dao.status = 'active';

  res.json({
    ok: true,
    dao
  });
});

// POST /api/dao/:code/proposal/create - Créer une proposition
app.post('/api/dao/:code/proposal/create', (req, res) => {
  const { proposerName, title, description, type, amount } = req.body;
  const dao = daos.get(req.params.code.toUpperCase());

  if (!dao) {
    return res.status(404).json({ error: 'DAO non trouvé' });
  }

  if (dao.status !== 'active') {
    return res.status(400).json({ error: 'Le DAO n\'est pas actif' });
  }

  // Vérifier que le proposeur est membre
  const member = dao.members.find(m => m.name === proposerName);
  if (!member) {
    return res.status(400).json({ error: 'Vous devez être membre du DAO' });
  }

  // Vérifier qu'il n'a pas déjà une proposition active
  const hasActiveProposal = dao.proposals.some(
    p => p.proposer === proposerName && p.status === 'active'
  );
  if (hasActiveProposal) {
    return res.status(400).json({ error: 'Vous avez déjà une proposition active' });
  }

  // Vérifier le montant pour les propositions de financement
  if (type === 'funding') {
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant invalide' });
    }
    if (amount > dao.treasuryBalance) {
      return res.status(400).json({ error: 'Montant supérieur au treasury' });
    }
  }

  const proposalId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();
  const votingEndsAt = now + (dao.votingDuration * 60 * 1000);

  const proposal = {
    id: proposalId,
    title,
    description: description || '',
    type,
    amount: type === 'funding' ? amount : 0,
    proposer: proposerName,
    createdAt: now,
    votingEndsAt,
    status: 'active',
    votes: {},
    results: { for: 0, against: 0, abstain: 0, quorumReached: false }
  };

  dao.proposals.push(proposal);

  res.json({
    ok: true,
    dao,
    proposal
  });
});

// POST /api/dao/:code/proposal/:proposalId/vote - Voter sur une proposition
app.post('/api/dao/:code/proposal/:proposalId/vote', (req, res) => {
  const { memberName, vote } = req.body; // vote: 'for' | 'against' | 'abstain'
  const dao = daos.get(req.params.code.toUpperCase());

  if (!dao) {
    return res.status(404).json({ error: 'DAO non trouvé' });
  }

  const proposal = dao.proposals.find(p => p.id === req.params.proposalId);
  if (!proposal) {
    return res.status(404).json({ error: 'Proposition non trouvée' });
  }

  if (proposal.status !== 'active') {
    return res.status(400).json({ error: 'Le vote est terminé' });
  }

  // Vérifier que le votant est membre
  const member = dao.members.find(m => m.name === memberName);
  if (!member) {
    return res.status(400).json({ error: 'Vous devez être membre du DAO' });
  }

  // Vérifier que la période de vote n'est pas terminée
  if (Date.now() > proposal.votingEndsAt) {
    proposal.status = 'rejected';
    return res.status(400).json({ error: 'La période de vote est terminée' });
  }

  // Enregistrer le vote
  const weight = member.tokens;
  proposal.votes[memberName] = { vote, weight };

  // Recalculer les résultats
  let forVotes = 0;
  let againstVotes = 0;
  let abstainVotes = 0;

  Object.values(proposal.votes).forEach(v => {
    if (v.vote === 'for') forVotes += v.weight;
    else if (v.vote === 'against') againstVotes += v.weight;
    else if (v.vote === 'abstain') abstainVotes += v.weight;
  });

  const totalVotes = forVotes + againstVotes + abstainVotes;
  const totalTokens = dao.members.reduce((sum, m) => sum + m.tokens, 0);
  const participationRate = (totalVotes / totalTokens) * 100;

  proposal.results = {
    for: forVotes,
    against: againstVotes,
    abstain: abstainVotes,
    quorumReached: participationRate >= dao.quorum
  };

  // Vérifier si tous ont voté
  const allVoted = dao.members.every(m => proposal.votes[m.name]);

  if (allVoted || Date.now() >= proposal.votingEndsAt) {
    // Finaliser le vote
    if (!proposal.results.quorumReached) {
      proposal.status = 'rejected';
    } else {
      const approvalRate = (forVotes / (forVotes + againstVotes)) * 100;
      if (approvalRate >= dao.approvalThreshold) {
        proposal.status = 'passed';
      } else {
        proposal.status = 'rejected';
      }
    }
  }

  res.json({
    ok: true,
    dao,
    proposal
  });
});

// POST /api/dao/:code/proposal/:proposalId/execute - Exécuter une proposition approuvée
app.post('/api/dao/:code/proposal/:proposalId/execute', (req, res) => {
  const dao = daos.get(req.params.code.toUpperCase());

  if (!dao) {
    return res.status(404).json({ error: 'DAO non trouvé' });
  }

  const proposal = dao.proposals.find(p => p.id === req.params.proposalId);
  if (!proposal) {
    return res.status(404).json({ error: 'Proposition non trouvée' });
  }

  if (proposal.status !== 'passed') {
    return res.status(400).json({ error: 'La proposition n\'a pas été approuvée' });
  }

  // Exécuter selon le type
  if (proposal.type === 'funding') {
    dao.treasuryBalance -= proposal.amount;
    // Dans une vraie application, on transférerait les fonds
  }

  proposal.status = 'executed';

  res.json({
    ok: true,
    dao,
    proposal,
    message: 'Proposition exécutée avec succès'
  });
});

// ---------------- Start server ----------------

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
