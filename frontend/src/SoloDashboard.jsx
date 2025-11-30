import React, { useState, useEffect } from 'react';

export function SoloDashboard({ classCode, classroom: initialClassroom, onStartDAO }) {
  const [classroom, setClassroom] = useState(initialClassroom);

  // Polling pour mettre à jour l'état
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}`);
        const data = await response.json();

        if (data.ok) {
          setClassroom(data.classroom);

          // Si le vote DAO a commencé ou si c'est terminé
          if (data.classroom.status === 'dao-voting' || data.classroom.status === 'completed') {
            onStartDAO(data.classroom);
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [classCode, onStartDAO]);

  // Calculer les statistiques
  const totalPlayers = classroom.participants.length;
  const progress = classroom.playerProgress || {};
  const playerNames = Object.keys(progress);

  const stats = {
    contract: 0,
    mining: 0,
    completed: 0,
    eliminated: 0
  };

  playerNames.forEach(name => {
    const p = progress[name];
    if (p.status === 'contract') stats.contract++;
    else if (p.status === 'mining') stats.mining++;
    else if (p.status === 'completed') stats.completed++;
    else if (p.status === 'eliminated') stats.eliminated++;
  });

  const canStartDAO = stats.completed >= 2;

  async function handleStartDAO() {
    if (!canStartDAO) {
      alert('Au moins 2 joueurs doivent avoir terminé pour lancer le vote DAO');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode}/solo/start-dao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.ok) {
        setClassroom(data.classroom);
        onStartDAO(data.classroom);
      } else {
        alert(data.error || 'Erreur lors du lancement du vote DAO');
      }
    } catch (err) {
      alert('Erreur de connexion');
      console.error(err);
    }
  }

  return (
    <section className="card">
      <h2>📊 Tableau de Bord - {classroom.name}</h2>
      <p className="muted">Mode Solo en Classe - Suivi en temps réel</p>

      {/* Statistiques globales */}
      <div style={{
        marginTop: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px'
      }}>
        <div style={{
          padding: '16px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
            TOTAL JOUEURS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#38bdf8' }}>
            {totalPlayers}
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(251, 191, 36, 0.1)',
          border: '2px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
            CHOIX CONTRAT
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>
            {stats.contract}
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
            EN MINING
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>
            {stats.mining}
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(74, 222, 128, 0.1)',
          border: '2px solid rgba(74, 222, 128, 0.4)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
            TERMINÉS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4ade80' }}>
            {stats.completed}
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(248, 113, 113, 0.1)',
          border: '2px solid rgba(248, 113, 113, 0.4)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
            ÉLIMINÉS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f87171' }}>
            {stats.eliminated}
          </div>
        </div>
      </div>

      {/* Liste des joueurs */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>👥 Progression des Joueurs</h3>

        {playerNames.length === 0 ? (
          <div className="notice" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>⏰ En attente que les joueurs commencent...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Joueur</th>
                  <th>Statut</th>
                  <th>Contrat</th>
                  <th>Validations</th>
                  <th>Mining</th>
                  <th>Score Total</th>
                </tr>
              </thead>
              <tbody>
                {playerNames.map((name, idx) => {
                  const p = progress[name];
                  const statusColors = {
                    contract: '#fbbf24',
                    mining: '#8b5cf6',
                    completed: '#4ade80',
                    eliminated: '#f87171'
                  };
                  const statusLabels = {
                    contract: '📝 Choix',
                    mining: '⛏️ Mining',
                    completed: '✅ Terminé',
                    eliminated: '❌ Éliminé'
                  };

                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: '600' }}>{name}</td>
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          background: `${statusColors[p.status]}20`,
                          border: `1px solid ${statusColors[p.status]}`,
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          color: statusColors[p.status],
                          fontWeight: '600'
                        }}>
                          {statusLabels[p.status]}
                        </span>
                      </td>
                      <td>
                        {p.contractChoice ? (
                          <span style={{ color: p.contractCorrect ? '#4ade80' : '#f87171' }}>
                            {p.contractCorrect ? '✓ Valide' : '✗ Invalide'}
                          </span>
                        ) : '—'}
                      </td>
                      <td>
                        {p.validationScore > 0 ? `${p.validationScore}/8` : '—'}
                      </td>
                      <td>
                        {p.status === 'mining' || p.miningCompleted ? (
                          <span>
                            {p.miningAttempts}/10
                            {p.miningCompleted && ' ✓'}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ fontWeight: '700', color: 'var(--accent)' }}>
                        {p.totalScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bouton pour démarrer le vote DAO */}
      {classroom.status === 'playing' && (
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button
            onClick={handleStartDAO}
            disabled={!canStartDAO}
            style={{
              padding: '16px 32px',
              fontSize: '1.1rem',
              background: canStartDAO ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : undefined,
              opacity: canStartDAO ? 1 : 0.5,
              cursor: canStartDAO ? 'pointer' : 'not-allowed'
            }}
          >
            🗳️ Lancer le Vote DAO Final
          </button>
          {!canStartDAO && (
            <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>
              Minimum 2 joueurs terminés requis
            </p>
          )}
        </div>
      )}

      {/* Infos DAO en cours */}
      {classroom.status === 'dao-voting' && (
        <div className="notice success-notice" style={{ marginTop: '24px', textAlign: 'center' }}>
          <strong>🗳️ Vote DAO en cours</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
            Les {stats.completed} joueurs qualifiés votent actuellement...
          </p>
        </div>
      )}

      {/* Résultats disponibles */}
      {classroom.status === 'completed' && (
        <div className="success-animation" style={{ marginTop: '24px', textAlign: 'center', padding: '24px' }}>
          <div className="success-checkmark">✓</div>
          <h3 style={{ marginTop: '16px', color: '#4ade80' }}>
            Challenge Terminé !
          </h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
            Les résultats finaux sont disponibles
          </p>
        </div>
      )}
    </section>
  );
}
