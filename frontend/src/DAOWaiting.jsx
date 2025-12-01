import React, { useState, useEffect } from 'react';

export function DAOWaiting({ daoCode, dao: initialDAO, onActivate }) {
  const [dao, setDAO] = useState(initialDAO);
  const [loading, setLoading] = useState(false);

  // Polling pour mettre à jour la liste des membres
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/dao/${daoCode}`);
        const data = await response.json();

        if (data.ok) {
          setDAO(data.dao);

          if (data.dao.status === 'active') {
            onActivate(data.dao);
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [daoCode, onActivate]);

  async function handleActivate() {
    if (dao.members.length < 2) {
      alert('Minimum 2 membres requis pour activer le DAO');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/dao/${daoCode}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.ok) {
        setDAO(data.dao);
        onActivate(data.dao);
      } else {
        alert(data.error || 'Erreur lors de l\'activation');
      }
    } catch (err) {
      alert('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalTokens = dao.members.length * dao.tokensPerMember;
  const canActivate = dao.members.length >= 2;

  return (
    <section className="card">
      <h2>🏛️ Salle d'Attente - {dao.name}</h2>
      <p className="muted">En attente des membres...</p>

      {/* Code du DAO */}
      <div style={{
        marginTop: '24px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
        border: '2px solid var(--accent)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
          CODE DU DAO
        </div>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          letterSpacing: '0.2em',
          fontFamily: 'monospace',
          color: 'var(--accent)'
        }}>
          {dao.code}
        </div>
        <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
          Partagez ce code avec les étudiants
        </p>
      </div>

      {/* Configuration du DAO */}
      <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>⚙️ Configuration</h3>

        <div style={{ display: 'grid', gap: '12px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Token de gouvernance:</span>
            <span style={{ fontWeight: '600' }}>{dao.tokenName} ({dao.tokenSymbol})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Tokens par membre:</span>
            <span style={{ fontWeight: '600', color: '#fbbf24' }}>{dao.tokensPerMember} {dao.tokenSymbol}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Quorum minimum:</span>
            <span style={{ fontWeight: '600' }}>{dao.quorum}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Seuil d'approbation:</span>
            <span style={{ fontWeight: '600' }}>{dao.approvalThreshold}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Durée des votes:</span>
            <span style={{ fontWeight: '600' }}>{dao.votingDuration} min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Treasury:</span>
            <span style={{ fontWeight: '600', color: '#4ade80' }}>{dao.treasuryBalance.toLocaleString()} unités</span>
          </div>
        </div>
      </div>

      {/* Liste des membres */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>
          👥 Membres ({dao.members.length})
        </h3>

        {dao.members.length === 0 ? (
          <div className="notice" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>⏰ En attente des premiers membres...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {dao.members.map((member, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a',
                    fontWeight: '700'
                  }}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '600' }}>{member.name}</span>
                </div>
                <div style={{
                  padding: '4px 12px',
                  background: 'rgba(251, 191, 36, 0.2)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#fbbf24'
                }}>
                  {member.tokens} {dao.tokenSymbol}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total des tokens */}
        {dao.members.length > 0 && (
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: '600' }}>Total Supply:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fbbf24' }}>
              {totalTokens.toLocaleString()} {dao.tokenSymbol}
            </span>
          </div>
        )}
      </div>

      {/* Bouton d'activation */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={handleActivate}
          disabled={!canActivate || loading}
          style={{
            padding: '16px 32px',
            fontSize: '1.1rem',
            background: canActivate ? 'linear-gradient(135deg, #4ade80, #22c55e)' : undefined,
            opacity: canActivate ? 1 : 0.5,
            cursor: canActivate ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Activation...' : '🚀 Activer le DAO'}
        </button>
        {!canActivate && (
          <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>
            Minimum 2 membres requis
          </p>
        )}
      </div>

      <div className="notice" style={{ marginTop: '20px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
        <strong>ℹ️ Après activation :</strong>
        <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
          <li>Tous les membres pourront créer des propositions</li>
          <li>Les votes seront pondérés selon les tokens détenus</li>
          <li>Une proposition ne peut passer sans atteindre le quorum</li>
        </ul>
      </div>
    </section>
  );
}
