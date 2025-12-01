import React, { useState, useEffect } from 'react';

export function SoloRoomDashboard({ roomCode, room: initialRoom, hostName, onBack }) {
  const [room, setRoom] = useState(initialRoom);

  // Polling pour mettre à jour les données de la salle
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/solo-room/${roomCode}`);
        const data = await response.json();

        if (data.ok) {
          setRoom(data.room);
        }
      } catch (err) {
        console.error('Erreur:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [roomCode]);

  const activePlayers = room.players.filter(p => p.status === 'playing').length;
  const eliminatedPlayers = room.players.filter(p => p.status === 'eliminated').length;
  const finishedPlayers = room.players.filter(p => p.status === 'finished').length;

  // Classement en temps réel
  const leaderboard = [...room.players].sort((a, b) => {
    // Tri par score puis par étape
    if (b.score !== a.score) return b.score - a.score;
    return b.currentStep - a.currentStep;
  });

  return (
    <section className="card">
      <h2>📊 Tableau de Bord - {room.name}</h2>
      <p className="muted">Hôte: {hostName}</p>

      {/* Code de la salle */}
      <div style={{
        marginTop: '24px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
        border: '2px solid rgba(139, 92, 246, 0.5)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
          CLÉ DE LA SALLE
        </div>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          letterSpacing: '0.2em',
          fontFamily: 'monospace',
          color: 'var(--accent)'
        }}>
          {room.code}
        </div>
        <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
          Partagez cette clé avec les joueurs
        </p>
      </div>

      {/* Statistiques */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        <div style={{
          padding: '16px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#38bdf8' }}>
            {room.players.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Joueurs Total
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4ade80' }}>
            {activePlayers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            En Jeu
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>
            {finishedPlayers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Terminés
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(248, 113, 113, 0.1)',
          border: '1px solid rgba(248, 113, 113, 0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f87171' }}>
            {eliminatedPlayers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Éliminés
          </div>
        </div>
      </div>

      {/* Classement en temps réel */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>🏆 Classement en Temps Réel</h3>

        {room.players.length === 0 ? (
          <div className="notice" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>⏰ En attente des premiers joueurs...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Joueur</th>
                  <th>Statut</th>
                  <th>Étape</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, idx) => {
                  const statusConfig = {
                    playing: { color: '#4ade80', label: '🎮 En jeu', bg: 'rgba(74, 222, 128, 0.2)' },
                    finished: { color: '#fbbf24', label: '✅ Terminé', bg: 'rgba(251, 191, 36, 0.2)' },
                    eliminated: { color: '#f87171', label: '❌ Éliminé', bg: 'rgba(248, 113, 113, 0.2)' }
                  };

                  const status = statusConfig[player.status] || statusConfig.playing;

                  return (
                    <tr key={idx}>
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
                      <td style={{ fontWeight: '600' }}>{player.name}</td>
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          background: status.bg,
                          border: `1px solid ${status.color}`,
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: status.color
                        }}>
                          {status.label}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>Étape {player.currentStep}</td>
                      <td style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '1.1rem' }}>
                        {player.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="notice" style={{ marginTop: '24px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
        <strong>ℹ️ Mode Hôte :</strong>
        <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
          <li>Les données se mettent à jour toutes les 2 secondes</li>
          <li>Vous pouvez suivre la progression de chaque joueur</li>
          <li>Le classement est calculé en temps réel</li>
        </ul>
      </div>

      <button onClick={onBack} style={{ marginTop: '24px', width: '100%' }}>
        Retour au Menu
      </button>
    </section>
  );
}
