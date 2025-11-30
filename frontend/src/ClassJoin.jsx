import React, { useState } from 'react';

export function ClassJoin({ onJoined, onBack }) {
  const [classCode, setClassCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleJoin() {
    if (!classCode.trim() || !participantName.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/class/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classCode: classCode.trim().toUpperCase(),
          participantName: participantName.trim()
        })
      });

      const data = await response.json();

      if (data.ok) {
        onJoined(classCode.trim().toUpperCase(), participantName.trim(), data.classroom);
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

  function handleCodeChange(e) {
    // Convertir automatiquement en majuscules
    setClassCode(e.target.value.toUpperCase());
  }

  return (
    <section className="card">
      <h2>🎓 Rejoindre une Classe</h2>
      <p className="muted">Entrez le code fourni par votre responsable pour rejoindre la classe</p>

      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Code de la classe
          </label>
          <input
            type="text"
            value={classCode}
            onChange={handleCodeChange}
            placeholder="Ex: ABC123"
            maxLength={6}
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              letterSpacing: '0.1em',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}
            disabled={loading}
          />
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Code à 6 caractères fourni par le responsable
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Votre nom
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Ex: Alice"
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="notice error-notice" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="notice" style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>ℹ️ Information :</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
            Après avoir rejoint, attendez que le responsable démarre la classe.
            Vous serez automatiquement assigné à un groupe de 4 personnes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} disabled={loading}>
            Retour
          </button>
          <button onClick={handleJoin} disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Connexion...' : 'Rejoindre la classe'}
          </button>
        </div>
      </div>
    </section>
  );
}
