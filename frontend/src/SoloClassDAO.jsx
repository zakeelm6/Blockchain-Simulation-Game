import React, { useState, useEffect } from 'react';

export function SoloClassDAO({ classCode, participantName, classroom: initialClassroom, onComplete }) {
  const [classroom, setClassroom] = useState(initialClassroom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const progress = classroom.playerProgress?.[participantName];
  const myScore = progress?.totalScore || 0;

  // Récupérer tous les joueurs qui ont terminé
  const completedPlayers = Object.keys(classroom.playerProgress || {}).filter(name =>
    classroom.playerProgress[name].status === 'completed'
  );

  const myVotes = classroom.daoVotes?.[participantName] || {};
  const votedCount = Object.keys(myVotes).length;
  const totalVotes = completedPlayers.filter(p => p !== participantName).length;
  const allVoted = votedCount === totalVotes;

  // Polling pour détecter la fin
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}`);
        const data = await response.json();

        if (data.ok) {
          setClassroom(data.classroom);

          if (data.classroom.status === 'completed') {
            onComplete(data.classroom);
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [classCode, onComplete]);

  async function handleVote(targetName, voteType) {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode}/solo/dao-vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterName: participantName,
          targetName,
          voteType
        })
      });

      const data = await response.json();

      if (data.ok) {
        setClassroom(data.classroom);
      } else {
        setError(data.error || 'Erreur lors du vote');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>🗳️ Vote DAO Final</h2>
      <p className="muted">Votez pour les autres participants qui ont terminé le challenge</p>

      {/* Info du joueur */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
        border: '2px solid rgba(251, 191, 36, 0.5)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fbbf24' }}>{participantName}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Poids de vote : {Math.floor(myScore / 10)}
            </p>
          </div>
          <div style={{
            padding: '12px 20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              SCORE ACTUEL
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent)' }}>
              {myScore}
            </div>
          </div>
        </div>
      </div>

      {/* Progression */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
          <span style={{ color: '#94a3b8' }}>Progression des votes</span>
          <span style={{ color: 'var(--accent)', fontWeight: '600' }}>
            {votedCount} / {totalVotes}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${totalVotes > 0 ? (votedCount / totalVotes) * 100 : 0}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent), #8b5cf6)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {allVoted ? (
        <div className="success-animation" style={{ marginTop: '20px', textAlign: 'center', padding: '24px', background: 'rgba(74, 222, 128, 0.1)', border: '2px solid rgba(74, 222, 128, 0.4)', borderRadius: '12px' }}>
          <div className="success-checkmark">✓</div>
          <h3 style={{ marginTop: '16px', color: '#4ade80' }}>
            Tous vos votes sont enregistrés !
          </h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
            En attente que tous les participants terminent...
          </p>
        </div>
      ) : (
        <>
          <div className="notice" style={{ marginBottom: '20px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <strong>ℹ️ Vote pondéré :</strong>
            <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
              <li>Votez POUR ou CONTRE chaque autre participant</li>
              <li>Votre poids de vote : <strong>{Math.floor(myScore / 10)}</strong> (basé sur vos {myScore} points)</li>
              <li>Vote POUR = +{Math.floor(myScore / 10) * 3} points pour la cible</li>
              <li>Vote CONTRE = -{Math.floor(myScore / 10)} points pour la cible</li>
            </ul>
          </div>

          {/* Liste des participants */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>👥 Participants Qualifiés</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {completedPlayers
                .filter(p => p !== participantName)
                .map((player, idx) => {
                  const hasVoted = myVotes[player] !== undefined;
                  const vote = myVotes[player];
                  const playerProgress = classroom.playerProgress[player];

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        background: hasVoted ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${hasVoted ? 'var(--accent)' : 'rgba(148, 163, 184, 0.2)'}`,
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
                            {player}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Score : {playerProgress?.totalScore || 0} points
                          </div>
                        </div>
                        {hasVoted && (
                          <div style={{
                            padding: '4px 12px',
                            background: vote === 'for' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                            border: `1px solid ${vote === 'for' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)'}`,
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: vote === 'for' ? '#4ade80' : '#f87171'
                          }}>
                            {vote === 'for' ? '✓ POUR' : '✗ CONTRE'}
                          </div>
                        )}
                      </div>

                      {!hasVoted && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <button
                            onClick={() => handleVote(player, 'against')}
                            disabled={loading}
                            style={{
                              background: 'rgba(248, 113, 113, 0.2)',
                              border: '2px solid rgba(248, 113, 113, 0.5)',
                              color: '#f87171',
                              padding: '10px',
                              fontSize: '0.85rem'
                            }}
                          >
                            ✗ CONTRE
                          </button>
                          <button
                            onClick={() => handleVote(player, 'for')}
                            disabled={loading}
                            style={{
                              background: 'rgba(74, 222, 128, 0.2)',
                              border: '2px solid rgba(74, 222, 128, 0.5)',
                              color: '#4ade80',
                              padding: '10px',
                              fontSize: '0.85rem'
                            }}
                          >
                            ✓ POUR
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="notice error-notice" style={{ marginTop: '16px' }}>
          {error}
        </div>
      )}
    </section>
  );
}
