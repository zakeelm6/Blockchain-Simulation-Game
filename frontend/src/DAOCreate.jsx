import React, { useState } from 'react';

export function DAOCreate({ onDAOCreated, onBack }) {
  const [daoName, setDaoName] = useState('');
  const [description, setDescription] = useState('');
  const [responsableName, setResponsableName] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokensPerMember, setTokensPerMember] = useState(100);
  const [quorum, setQuorum] = useState(50);
  const [approvalThreshold, setApprovalThreshold] = useState(51);
  const [votingDuration, setVotingDuration] = useState(60);
  const [treasuryBalance, setTreasuryBalance] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!daoName.trim() || !responsableName.trim() || !tokenName.trim() || !tokenSymbol.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/dao/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daoName: daoName.trim(),
          description: description.trim(),
          responsableName: responsableName.trim(),
          tokenName: tokenName.trim(),
          tokenSymbol: tokenSymbol.trim().toUpperCase(),
          tokensPerMember,
          quorum,
          approvalThreshold,
          votingDuration,
          treasuryBalance
        })
      });

      const data = await response.json();

      if (data.ok) {
        onDAOCreated(data.code, data.dao);
      } else {
        setError(data.error || 'Erreur lors de la création');
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
      <h2>🏛️ Créer un DAO</h2>
      <p className="muted">Configurez votre Organisation Autonome Décentralisée</p>

      <div style={{ marginTop: '24px' }}>
        {/* Informations de base */}
        <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--accent)' }}>📋 Informations de Base</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Nom du DAO *
            </label>
            <input
              type="text"
              value={daoName}
              onChange={(e) => setDaoName(e.target.value)}
              placeholder="Ex: EduDAO"
              style={{ width: '100%' }}
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'objectif de votre DAO..."
              style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Votre nom (Créateur) *
            </label>
            <input
              type="text"
              value={responsableName}
              onChange={(e) => setResponsableName(e.target.value)}
              placeholder="Ex: Prof. Martin"
              style={{ width: '100%' }}
              disabled={loading}
            />
          </div>
        </div>

        {/* Token de gouvernance */}
        <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#fbbf24' }}>🪙 Token de Gouvernance</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Nom du token *
              </label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Ex: EduToken"
                style={{ width: '100%' }}
                disabled={loading}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Symbole *
              </label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                placeholder="Ex: EDU"
                style={{ width: '100%', textTransform: 'uppercase' }}
                maxLength={5}
                disabled={loading}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Tokens par membre
              </label>
              <input
                type="number"
                min="1"
                value={tokensPerMember}
                onChange={(e) => setTokensPerMember(parseInt(e.target.value) || 100)}
                style={{ width: '100%' }}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Paramètres de gouvernance */}
        <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#8b5cf6' }}>⚙️ Paramètres de Gouvernance</h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Quorum minimum : {quorum}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={quorum}
                onChange={(e) => setQuorum(parseInt(e.target.value))}
                style={{ width: '100%' }}
                disabled={loading}
              />
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                Pourcentage minimum de tokens devant participer au vote
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Seuil d'approbation : {approvalThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={approvalThreshold}
                onChange={(e) => setApprovalThreshold(parseInt(e.target.value))}
                style={{ width: '100%' }}
                disabled={loading}
              />
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                Pourcentage de votes POUR requis pour approuver une proposition
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Durée des votes : {votingDuration} minutes
              </label>
              <input
                type="range"
                min="1"
                max="1440"
                step="1"
                value={votingDuration}
                onChange={(e) => setVotingDuration(parseInt(e.target.value))}
                style={{ width: '100%' }}
                disabled={loading}
              />
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                Durée pendant laquelle les membres peuvent voter (max 24h)
              </p>
            </div>
          </div>
        </div>

        {/* Treasury */}
        <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#4ade80' }}>💰 Treasury (Trésorerie)</h3>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Budget initial : {treasuryBalance.toLocaleString()} unités
            </label>
            <input
              type="range"
              min="1000"
              max="1000000"
              step="1000"
              value={treasuryBalance}
              onChange={(e) => setTreasuryBalance(parseInt(e.target.value))}
              style={{ width: '100%' }}
              disabled={loading}
            />
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              Fonds disponibles pour les propositions de financement
            </p>
          </div>
        </div>

        {error && (
          <div className="notice error-notice" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} disabled={loading}>
            Retour
          </button>
          <button onClick={handleCreate} disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Création...' : 'Créer le DAO'}
          </button>
        </div>
      </div>
    </section>
  );
}
