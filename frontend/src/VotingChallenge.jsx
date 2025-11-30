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
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [votingComplete, setVotingComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finalRankings, setFinalRankings] = useState([]);
  const [animatingVote, setAnimatingVote] = useState(null);

  useEffect(() => {
    // Initialiser les participants avec le joueur
    const allParticipants = [
      { id: 'player', name: playerName, avatar: '👤', initialScore: playerScore, isPlayer: true },
      ...PARTICIPANTS.map(p => ({ ...p, isPlayer: false }))
    ];
    setParticipants(allParticipants);
  }, [playerName, playerScore]);

  const currentParticipant = participants[currentParticipantIndex];
  const votingParticipants = participants.filter((p, idx) => idx !== currentParticipantIndex);

  function handleVote(targetId, voteType) {
    setAnimatingVote({ targetId, voteType });

    setTimeout(() => {
      const newVotes = { ...votes };
      if (!newVotes[currentParticipant.id]) {
        newVotes[currentParticipant.id] = {};
      }
      newVotes[currentParticipant.id][targetId] = voteType;
      setVotes(newVotes);
      setAnimatingVote(null);

      // Vérifier si tous les votes sont terminés pour ce participant
      const votedCount = Object.keys(newVotes[currentParticipant.id] || {}).length;
      if (votedCount === participants.length - 1) {
        // Passer au participant suivant ou terminer
        if (currentParticipantIndex < participants.length - 1) {
          setTimeout(() => {
            setCurrentParticipantIndex(currentParticipantIndex + 1);
          }, 500);
        } else {
          // Tous les participants ont voté
          setTimeout(() => {
            setVotingComplete(true);
            calculateResults();
          }, 1000);
        }
      }
    }, 800);
  }

  function calculateResults() {
    // Calculer les scores finaux basés sur les votes
    const scores = {};

    participants.forEach(p => {
      scores[p.id] = p.initialScore;
    });

    // Appliquer les votes
    Object.keys(votes).forEach(voterId => {
      const voterScore = participants.find(p => p.id === voterId)?.initialScore || 0;
      const voterVotes = votes[voterId];

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
        for: Object.values(votes).filter(v => v[p.id] === 'for').length,
        against: Object.values(votes).filter(v => v[p.id] === 'against').length
      }
    }));

    rankings.sort((a, b) => b.finalScore - a.finalScore);
    setFinalRankings(rankings);

    setTimeout(() => {
      setShowResults(true);
    }, 1500);
  }

  if (!currentParticipant) {
    return (
      <section className="card">
        <div className="spinner"></div>
        <p className="muted small">Initialisation du vote...</p>
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

  const votedFor = votes[currentParticipant.id] || {};
  const votedCount = Object.keys(votedFor).length;
  const totalToVote = participants.length - 1;

  return (
    <section className="card">
      <h2>🗳️ Vote DAO - Gouvernance décentralisée</h2>
      <p className="muted small">
        Votez POUR ou CONTRE chaque participant. Le poids de votre vote dépend de votre score.
      </p>

      {/* Participant actuel qui vote */}
      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem' }}>{currentParticipant.avatar}</div>
        <h3 style={{ margin: '8px 0 4px', fontSize: '1rem' }}>{currentParticipant.name}</h3>
        <p className="small muted" style={{ margin: 0 }}>
          Score: {currentParticipant.initialScore} points | Poids du vote: ×{Math.floor(currentParticipant.initialScore / 10)}
        </p>
        <p className="small" style={{ marginTop: '8px' }}>
          Progression: {votedCount}/{totalToVote} votes effectués
        </p>
      </div>

      {/* Cercle des participants */}
      <div style={{ marginTop: '24px', position: 'relative', height: '400px' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {votingParticipants.map((participant, index) => {
            const angle = (index / votingParticipants.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 150;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const hasVoted = votedFor[participant.id];
            const isAnimating = animatingVote?.targetId === participant.id;

            return (
              <div
                key={participant.id}
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
                      ? votedFor[participant.id] === 'for'
                        ? 'rgba(74, 222, 128, 0.2)'
                        : 'rgba(248, 113, 113, 0.2)'
                      : 'rgba(15, 23, 42, 0.8)',
                    border: `2px solid ${
                      hasVoted
                        ? votedFor[participant.id] === 'for'
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
                  <div style={{ fontSize: '1.5rem' }}>{participant.avatar}</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: hasVoted ? '600' : '400' }}>
                    {participant.name.split('-')[0]}
                  </div>
                  {hasVoted && (
                    <div style={{ fontSize: '1rem', marginTop: '4px' }}>
                      {votedFor[participant.id] === 'for' ? '✅' : '❌'}
                    </div>
                  )}
                  {!hasVoted && !isAnimating && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleVote(participant.id, 'for')}
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
                        onClick={() => handleVote(participant.id, 'against')}
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

          {/* Participant central (qui vote) */}
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
            {currentParticipant.avatar}
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
