import React, { useState, useEffect } from 'react';

const PARTICIPANTS = [
  { id: 1, name: 'ValidatorBot-01', avatar: '🤖', initialScore: Math.floor(Math.random() * 50) + 50 },
  { id: 2, name: 'CryptoExpert-42', avatar: '🤖', initialScore: Math.floor(Math.random() * 50) + 50 },
  { id: 3, name: 'SmartNode-007', avatar: '🤖', initialScore: Math.floor(Math.random() * 50) + 50 },
  { id: 4, name: 'BlockMaster-99', avatar: '🤖', initialScore: Math.floor(Math.random() * 50) + 50 },
  { id: 5, name: 'ChainGuard-23', avatar: '🤖', initialScore: Math.floor(Math.random() * 50) + 50 },
  { id: 6, name: 'LedgerKeeper-56', avatar: '🤖', initialScore: Math.floor(Math.random() * 50) + 50 },
  { id: 7, name: 'ByteSage-78', avatar: '🤖', initialScore: Math.floor(Math.random() * 50) + 50 },
  { id: 8, name: 'HashWizard-34', avatar: '🤖', initialScore: Math.floor(Math.random() * 50) + 50 }
];

export function VotingChallenge({ playerName, playerScore, onComplete, onBack }) {
  const [participants, setParticipants] = useState([]);
  const [votes, setVotes] = useState({});
  const [playerVotingComplete, setPlayerVotingComplete] = useState(false);
  const [botsVoting, setBotsVoting] = useState(false);
  const [votingComplete, setVotingComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finalRankings, setFinalRankings] = useState([]);
  const [animatingVote, setAnimatingVote] = useState(null);
  const [currentBotVoting, setCurrentBotVoting] = useState(null);

  useEffect(() => {
    // Initialiser les participants avec le joueur
    const allParticipants = [
      { id: 'player', name: playerName, avatar: '👤', initialScore: playerScore, isPlayer: true },
      ...PARTICIPANTS.map(p => ({ ...p, isPlayer: false }))
    ];
    setParticipants(allParticipants);
  }, [playerName, playerScore]);

  // Générer les votes automatiques des bots
  function generateBotVotes() {
    const newVotes = { ...votes };
    const bots = participants.filter(p => !p.isPlayer);

    bots.forEach(bot => {
      newVotes[bot.id] = {};
      // Voter pour tous les autres participants sauf soi-même
      participants.forEach(target => {
        if (target.id !== bot.id) {
          // Vote aléatoire : 60% pour, 40% contre
          const voteType = Math.random() < 0.6 ? 'for' : 'against';
          newVotes[bot.id][target.id] = voteType;
        }
      });
    });

    return newVotes;
  }

  // Animer les votes des bots
  function animateBotsVoting() {
    setBotsVoting(true);
    const bots = participants.filter(p => !p.isPlayer);
    let currentBotIndex = 0;

    const interval = setInterval(() => {
      if (currentBotIndex < bots.length) {
        setCurrentBotVoting(bots[currentBotIndex]);
        currentBotIndex++;
      } else {
        clearInterval(interval);
        setCurrentBotVoting(null);
        setTimeout(() => {
          setVotingComplete(true);
          const allVotes = generateBotVotes();
          setVotes(allVotes);
          calculateResults(allVotes);
        }, 300);
      }
    }, 300);
  }

  // Vote du joueur seulement
  function handlePlayerVote(targetId, voteType) {
    setAnimatingVote({ targetId, voteType });

    setTimeout(() => {
      const newVotes = { ...votes };
      if (!newVotes['player']) {
        newVotes['player'] = {};
      }
      newVotes['player'][targetId] = voteType;
      setVotes(newVotes);
      setAnimatingVote(null);

      // Vérifier si le joueur a voté pour tous les autres participants
      const votedCount = Object.keys(newVotes['player'] || {}).length;
      if (votedCount === participants.length - 1) {
        // Le joueur a terminé, lancer les votes des bots
        setTimeout(() => {
          setPlayerVotingComplete(true);
          animateBotsVoting();
        }, 300);
      }
    }, 400);
  }

  function calculateResults(allVotes) {
    // Calculer les scores finaux basés sur les votes
    const scores = {};

    participants.forEach(p => {
      scores[p.id] = p.initialScore;
    });

    // Appliquer les votes
    Object.keys(allVotes).forEach(voterId => {
      const voterScore = participants.find(p => p.id === voterId)?.initialScore || 0;
      const voterVotes = allVotes[voterId];

      Object.keys(voterVotes).forEach(targetId => {
        const voteType = voterVotes[targetId];
        const weight = Math.floor(voterScore / 10); // Le poids du vote dépend du score du votant

        if (voteType === 'for') {
          scores[targetId] = (scores[targetId] || 0) + (weight * 3); // Vote pour = +3 × poids
        } else if (voteType === 'against') {
          scores[targetId] = (scores[targetId] || 0) - weight; // Vote contre = -1 × poids
        }
      });
    });

    // Créer le classement final
    const rankings = participants.map(p => ({
      ...p,
      finalScore: scores[p.id] || p.initialScore,
      votesReceived: {
        for: Object.values(allVotes).filter(v => v[p.id] === 'for').length,
        against: Object.values(allVotes).filter(v => v[p.id] === 'against').length
      }
    }));

    rankings.sort((a, b) => b.finalScore - a.finalScore);
    setFinalRankings(rankings);

    setTimeout(() => {
      setShowResults(true);
    }, 1500);
  }

  if (participants.length === 0) {
    return (
      <section className="card">
        <div className="spinner"></div>
        <p className="muted small">Initialisation du vote...</p>
      </section>
    );
  }

  // Animation des votes des bots
  if (botsVoting) {
    return (
      <section className="card">
        <h2>🤖 Votes des validateurs en cours...</h2>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          {currentBotVoting && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{currentBotVoting.avatar}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{currentBotVoting.name}</h3>
              <p className="muted small">Vote en cours...</p>
            </>
          )}
          <div className="spinner" style={{ marginTop: '20px' }}></div>
        </div>
      </section>
    );
  }

  if (showResults) {
    const playerRanking = finalRankings.findIndex(p => p.isPlayer) + 1;
    const playerData = finalRankings.find(p => p.isPlayer);

    return (
      <section className="card">
        <h2>🏆 Résultats du Vote DAO</h2>

        <div className="notice success-notice" style={{ marginTop: '16px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Votre classement : #{playerRanking} / {finalRankings.length}</h3>
          <p style={{ margin: 0 }}>Score final : {playerData?.finalScore} points</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '0.95rem' }}>📊 Classement final</h3>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Participant</th>
                <th>Score initial</th>
                <th>Votes Pour</th>
                <th>Votes Contre</th>
                <th>Score final</th>
              </tr>
            </thead>
            <tbody>
              {finalRankings.map((p, idx) => (
                <tr
                  key={p.id}
                  style={{
                    background: p.isPlayer ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    fontWeight: p.isPlayer ? '600' : '400'
                  }}
                >
                  <td>{idx + 1}</td>
                  <td>
                    <span style={{ marginRight: '8px' }}>{p.avatar}</span>
                    {p.name}
                    {p.isPlayer && <span style={{ marginLeft: '8px', color: 'var(--accent)' }}>(Vous)</span>}
                  </td>
                  <td>{p.initialScore}</td>
                  <td style={{ color: '#4ade80' }}>+{p.votesReceived.for}</td>
                  <td style={{ color: '#f87171' }}>-{p.votesReceived.against}</td>
                  <td style={{ fontWeight: '700', color: 'var(--accent)' }}>{p.finalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => onComplete?.(playerData)}>
            Terminer le challenge
          </button>
        </div>
      </section>
    );
  }

  if (votingComplete) {
    return (
      <section className="card">
        <div className="success-animation" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="success-checkmark">✓</div>
          <h2 style={{ marginTop: '20px' }}>Vote terminé !</h2>
          <p className="muted small">Calcul des résultats en cours...</p>
          <div className="spinner" style={{ marginTop: '20px' }}></div>
        </div>
      </section>
    );
  }

  const player = participants.find(p => p.isPlayer);
  const bots = participants.filter(p => !p.isPlayer);
  const votedFor = votes['player'] || {};
  const votedCount = Object.keys(votedFor).length;
  const totalToVote = bots.length;

  return (
    <section className="card">
      <h2>🗳️ Vote DAO - Gouvernance décentralisée</h2>
      <p className="muted small">
        Votez POUR ou CONTRE chaque validateur. Le poids de votre vote dépend de votre score.
      </p>

      {/* Joueur qui vote */}
      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem' }}>{player?.avatar}</div>
        <h3 style={{ margin: '8px 0 4px', fontSize: '1rem' }}>{player?.name}</h3>
        <p className="small muted" style={{ margin: 0 }}>
          Score: {player?.initialScore} points | Poids du vote: ×{Math.floor((player?.initialScore || 0) / 10)}
        </p>
        <p className="small" style={{ marginTop: '8px' }}>
          Progression: {votedCount}/{totalToVote} votes effectués
        </p>
      </div>

      {/* Cercle des validateurs bots */}
      <div style={{ marginTop: '24px', position: 'relative', height: '400px' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {bots.map((bot, index) => {
            const angle = (index / bots.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 150;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const hasVoted = votedFor[bot.id];
            const isAnimating = animatingVote?.targetId === bot.id;

            return (
              <div
                key={bot.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: hasVoted
                      ? votedFor[bot.id] === 'for'
                        ? 'rgba(74, 222, 128, 0.2)'
                        : 'rgba(248, 113, 113, 0.2)'
                      : 'rgba(15, 23, 42, 0.8)',
                    border: `2px solid ${
                      hasVoted
                        ? votedFor[bot.id] === 'for'
                          ? '#4ade80'
                          : '#f87171'
                        : 'rgba(148, 163, 184, 0.3)'
                    }`,
                    borderRadius: '12px',
                    textAlign: 'center',
                    minWidth: '100px',
                    animation: isAnimating ? 'pulse 0.8s ease-in-out' : 'none'
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{bot.avatar}</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: hasVoted ? '600' : '400' }}>
                    {bot.name.split('-')[0]}
                  </div>
                  {hasVoted && (
                    <div style={{ fontSize: '1rem', marginTop: '4px' }}>
                      {votedFor[bot.id] === 'for' ? '✅' : '❌'}
                    </div>
                  )}
                  {!hasVoted && !isAnimating && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handlePlayerVote(bot.id, 'for')}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          background: 'rgba(74, 222, 128, 0.3)',
                          borderColor: '#4ade80'
                        }}
                        title="Vote POUR"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handlePlayerVote(bot.id, 'against')}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          background: 'rgba(248, 113, 113, 0.3)',
                          borderColor: '#f87171'
                        }}
                        title="Vote CONTRE"
                      >
                        ✗
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Joueur au centre */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '16px',
              background: 'rgba(56, 189, 248, 0.2)',
              border: '3px solid var(--accent)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.5)'
            }}
          >
            {player?.avatar}
          </div>
        </div>
      </div>

      {/* Légende */}
      <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '0.85rem', margin: '0 0 8px 0' }}>💡 Système de vote</h3>
        <ul style={{ fontSize: '0.75rem', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Vote POUR : +3 points × poids du vote</li>
          <li>Vote CONTRE : -1 point × poids du vote</li>
          <li>Poids du vote = Score ÷ 10</li>
          <li>Cliquez sur ✓ (POUR) ou ✗ (CONTRE) pour chaque participant</li>
        </ul>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
        {onBack && (
          <button className="btn-outline" onClick={onBack}>
            Retour
          </button>
        )}
      </div>
    </section>
  );
}
