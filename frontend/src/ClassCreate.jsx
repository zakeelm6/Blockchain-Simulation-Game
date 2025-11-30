import React, { useState } from 'react';

export function ClassCreate({ onClassCreated, onBack }) {
  const [className, setClassName] = useState('');
  const [responsableName, setResponsableName] = useState('');
  const [mode, setMode] = useState('team'); // 'team' ou 'solo'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!className.trim() || !responsableName.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/class/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: className.trim(),
          responsableName: responsableName.trim(),
          mode: mode
        })
      });

      const data = await response.json();

      if (data.ok) {
        onClassCreated(data.code, data.classroom);
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
      <h2>👨‍🏫 Créer une Classe</h2>
      <p className="muted">En tant que responsable, créez une nouvelle classe pour vos participants</p>

      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Nom de la classe
          </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Ex: Blockchain 101"
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Votre nom (Responsable)
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
            Mode de jeu
          </label>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              onClick={() => setMode('team')}
              style={{
                padding: '16px',
                background: mode === 'team' ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))' : 'rgba(0,0,0,0.3)',
                border: `2px solid ${mode === 'team' ? 'var(--accent)' : 'rgba(148, 163, 184, 0.3)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2rem' }}>👥</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Mode Équipe</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                    Groupes de 4 : vote en équipe, validation, mining et vote DAO
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setMode('solo')}
              style={{
                padding: '16px',
                background: mode === 'solo' ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))' : 'rgba(0,0,0,0.3)',
                border: `2px solid ${mode === 'solo' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(148, 163, 184, 0.3)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2rem' }}>🎮</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Mode Solo en Classe</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                    Chaque joueur progresse individuellement avec validation bot
                  </p>
                </div>
              </div>
            </div>
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
            {loading ? 'Création...' : 'Créer la classe'}
          </button>
        </div>
      </div>
    </section>
  );
}
