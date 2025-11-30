import React from 'react';

export function Results({ playerName, gameHistory, onBackToHome }) {
  const { validation, mining, voting } = gameHistory;

  if (!validation || !mining || !voting) {
    return (
      <section className="card">
        <p className="muted">Chargement des résultats...</p>
      </section>
    );
  }

  const totalScore = validation.points + mining.points + (voting.finalScore || 0);

  return (
    <section className="card">
      <h2>🎉 Challenge Terminé !</h2>

      <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏆</div>
        <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--accent)' }}>{playerName}</h1>
        <p className="muted">Félicitations pour avoir terminé le challenge blockchain !</p>
      </div>

      {/* Résumé du Vote DAO */}
      <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(56, 189, 248, 0.1)', border: '2px solid var(--accent)', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>🗳️ Résultats du Vote DAO</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Classement final</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>#{voting.ranking}</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>sur {voting.totalParticipants} participants</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Score final</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>{voting.finalScore}</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>points</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ padding: '8px', background: 'rgba(74, 222, 128, 0.2)', border: '1px solid rgba(74, 222, 128, 0.4)', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Votes POUR reçus</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#4ade80' }}>+{voting.votesFor || 0}</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(248, 113, 113, 0.2)', border: '1px solid rgba(248, 113, 113, 0.4)', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Votes CONTRE reçus</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#f87171' }}>-{voting.votesAgainst || 0}</div>
          </div>
        </div>
      </div>

      {/* Récapitulatif complet du parcours */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>📊 Récapitulatif complet</h3>

        {/* Étape 1 : Validation */}
        <div style={{ marginBottom: '12px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>✅</span>
              <strong>Étape 1 : Validation Smart Contract</strong>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>
              +{validation.points} pts
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '32px' }}>
            {validation.correct ? (
              <>
                ✓ Contrat correct identifié (+10 pts)
                <br />
                ✓ {validation.validVotes} validateurs d'accord (+{validation.validVotes * 2} pts)
              </>
            ) : (
              <>
                ✗ Contrat incorrect choisi (+3 pts pour la tentative)
                <br />
                ✓ {validation.validVotes} validateurs ont participé (+{validation.validVotes * 2} pts)
              </>
            )}
          </div>
        </div>

        {/* Étape 2 : Mining */}
        <div style={{ marginBottom: '12px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>⛏️</span>
              <strong>Étape 2 : Mining Challenge</strong>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>
              +{mining.points} pts
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '32px' }}>
            ✓ Nonce trouvé en {mining.attempts} tentative{mining.attempts > 1 ? 's' : ''}
            <br />
            {mining.attempts === 1 && '⭐ Performance exceptionnelle ! (+20 pts)'}
            {mining.attempts <= 3 && mining.attempts > 1 && '🌟 Très bonne performance (+15 pts)'}
            {mining.attempts <= 6 && mining.attempts > 3 && '👍 Bonne performance (+10 pts)'}
            {mining.attempts > 6 && '✓ Mission accomplie (+5 pts)'}
          </div>
        </div>

        {/* Étape 3 : Vote DAO */}
        <div style={{ marginBottom: '12px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🗳️</span>
              <strong>Étape 3 : Vote DAO</strong>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>
              Score: {voting.finalScore} pts
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '32px' }}>
            ✓ Participation au vote DAO décentralisé
            <br />
            ✓ Classement final : #{voting.ranking}/{voting.totalParticipants}
          </div>
        </div>
      </div>

      {/* Score total */}
      <div style={{ marginTop: '24px', padding: '20px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))', border: '2px solid var(--accent)', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>SCORE TOTAL DU PARCOURS</div>
        <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px' }}>{totalScore}</div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          points au total
        </div>
      </div>

      {/* Badges / Achievements */}
      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>🏅 Badges obtenus</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {validation.correct && (
            <div style={{ padding: '6px 12px', background: 'rgba(74, 222, 128, 0.2)', border: '1px solid rgba(74, 222, 128, 0.4)', borderRadius: '20px', fontSize: '0.75rem', color: '#4ade80' }}>
              🎯 Validateur Expert
            </div>
          )}
          {mining.attempts <= 3 && (
            <div style={{ padding: '6px 12px', background: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: '20px', fontSize: '0.75rem', color: '#fbbf24' }}>
              ⛏️ Mineur Efficace
            </div>
          )}
          {voting.ranking <= 3 && (
            <div style={{ padding: '6px 12px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '20px', fontSize: '0.75rem', color: '#a855f7' }}>
              🏆 Top 3 DAO
            </div>
          )}
          {totalScore >= 100 && (
            <div style={{ padding: '6px 12px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '20px', fontSize: '0.75rem', color: '#38bdf8' }}>
              ⭐ Score d'Excellence
            </div>
          )}
        </div>
      </div>

      {/* Bouton retour */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button onClick={onBackToHome} style={{ padding: '12px 32px', fontSize: '1rem' }}>
          Retour à l'accueil
        </button>
      </div>
    </section>
  );
}
