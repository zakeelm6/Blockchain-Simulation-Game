import React, { useState } from 'react';

export function DAOJoin({ onJoined, onBack }) {
  const [daoCode, setDaoCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleJoin() {
    if (!daoCode.trim() || !memberName.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/dao/${daoCode.trim().toUpperCase()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: memberName.trim()
        })
      });

      const data = await response.json();

      if (data.ok) {
        onJoined(daoCode.trim().toUpperCase(), memberName.trim(), data.dao);
      } else {
        setError(data.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>🏛️ Rejoindre un DAO</h2>
      <p className="muted">Participez à une Organisation Autonome Décentralisée</p>

      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Code du DAO
          </label>
          <input
            type="text"
            value={daoCode}
            onChange={(e) => setDaoCode(e.target.value.toUpperCase())}
            placeholder="Ex: ABC123"
            style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.2rem', fontFamily: 'monospace' }}
            maxLength={6}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && memberName && handleJoin()}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Votre nom
          </label>
          <input
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Ex: Alice"
            style={{ width: '100%' }}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && daoCode && handleJoin()}
          />
        </div>

        {error && (
          <div className="notice error-notice" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="notice" style={{ marginBottom: '16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>ℹ️ En tant que membre du DAO :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Vous recevrez des tokens de gouvernance</li>
            <li>Vous pourrez créer des propositions</li>
            <li>Vous pourrez voter sur toutes les propositions</li>
            <li>Votre poids de vote dépend de vos tokens</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} disabled={loading}>
            Retour
          </button>
          <button onClick={handleJoin} disabled={loading || !daoCode || !memberName} style={{ flex: 1 }}>
            {loading ? 'Connexion...' : 'Rejoindre'}
          </button>
        </div>
      </div>
    </section>
  );
}
