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

// ---------------- Start server ----------------

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
