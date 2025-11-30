import React from 'react';

export function ClassResults({ classroom, participantName, onBackToHome }) {
  if (!classroom.finalRankings) {
    return (
      <section className="card">
        <p className="muted">Chargement des résultats...</p>
      </section>
    );
  }

  const myRanking = classroom.finalRankings.find(r => r.name === participantName);
  const myPosition = classroom.finalRankings.findIndex(r => r.name === participantName) + 1;

  return (
    <section className="card">
      <h2>🏆 Résultats Finaux - {classroom.name}</h2>
      <p className="muted">Challenge blockchain terminé !</p>

      {/* Mon résultat */}
      {myRanking && (
        <div style={{
          marginTop: '24px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
          border: '2px solid var(--accent)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
            {myPosition === 1 ? '🥇' : myPosition === 2 ? '🥈' : myPosition === 3 ? '🥉' : '🏅'}
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--accent)' }}>
            {participantName}
          </h3>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '16px' }}>
            Classement : #{myPosition} sur {classroom.finalRankings.length} participants
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                SCORE INITIAL
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>
                {myRanking.initialScore}
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                VOTES REÇUS
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                <span style={{ color: '#4ade80' }}>+{myRanking.votesFor}</span>
                {' / '}
                <span style={{ color: '#f87171' }}>-{myRanking.votesAgainst}</span>
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                SCORE FINAL
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                {myRanking.finalScore}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Podium */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>🏆 Podium</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {classroom.finalRankings.slice(0, 3).map((player, idx) => {
            const isMe = player.name === participantName;
            const medals = ['🥇', '🥈', '🥉'];

            return (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  background: isMe
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))'
                    : idx === 0
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))'
                    : 'rgba(0,0,0,0.3)',
                  border: `2px solid ${
                    isMe
                      ? 'var(--accent)'
                      : idx === 0
                      ? 'rgba(251, 191, 36, 0.5)'
                      : 'rgba(148, 163, 184, 0.2)'
                  }`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  width: '60px',
                  textAlign: 'center'
                }}>
                  {medals[idx]}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>
                    {player.name}
                    {isMe && <span style={{ marginLeft: '8px', color: 'var(--accent)', fontSize: '0.85rem' }}>(Vous)</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Score initial : {player.initialScore} • Votes : +{player.votesFor} / -{player.votesAgainst}
                  </div>
                </div>

                <div style={{
                  padding: '12px 20px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                    FINAL
                  </div>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: idx === 0 ? '#fbbf24' : 'var(--accent)'
                  }}>
                    {player.finalScore}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classement complet */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>📊 Classement Complet</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Participant</th>
                <th>Score Initial</th>
                <th>Votes POUR</th>
                <th>Votes CONTRE</th>
                <th>Score Final</th>
              </tr>
            </thead>
            <tbody>
              {classroom.finalRankings.map((player, idx) => {
                const isMe = player.name === participantName;

                return (
                  <tr
                    key={idx}
                    style={{
                      background: isMe ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      fontWeight: isMe ? '600' : '400'
                    }}
                  >
                    <td>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: idx < 3 ? 'var(--accent)' : 'rgba(148, 163, 184, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: idx < 3 ? '#0f172a' : '#fff',
                        fontWeight: '700'
                      }}>
                        {idx + 1}
                      </div>
                    </td>
                    <td>
                      {player.name}
                      {isMe && <span style={{ marginLeft: '8px', color: 'var(--accent)', fontSize: '0.85rem' }}>(Vous)</span>}
                    </td>
                    <td>{player.initialScore}</td>
                    <td style={{ color: '#4ade80', fontWeight: '600' }}>+{player.votesFor}</td>
                    <td style={{ color: '#f87171', fontWeight: '600' }}>-{player.votesAgainst}</td>
                    <td style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '1.1rem' }}>
                      {player.finalScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques de la classe */}
      <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>📈 Statistiques de la Classe</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              Total Participants
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
              {classroom.participants.length}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              Équipes Formées
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
              {classroom.groups.length}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              Finalistes
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
              {classroom.finalRankings.length}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              Créée par
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#38bdf8' }}>
              {classroom.createdBy}
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button onClick={onBackToHome} style={{ padding: '14px 40px', fontSize: '1.1rem' }}>
          Retour à l'accueil
        </button>
      </div>
    </section>
  );
}
