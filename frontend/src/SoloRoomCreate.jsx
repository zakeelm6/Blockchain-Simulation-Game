import React, { useState } from 'react';

export function SoloRoomCreate({ onRoomCreated, onBack }) {
  const [roomName, setRoomName] = useState('');
  const [hostName, setHostName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!roomName.trim() || !hostName.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/solo-room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: roomName.trim(),
          hostName: hostName.trim()
        })
      });

      const data = await response.json();

      if (data.ok) {
        onRoomCreated(data.code, data.room, hostName.trim());
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
      <h2>🎮 Créer une Salle Solo</h2>
      <p className="muted">Configurez votre salle de jeu individuel</p>

      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Nom de la salle *
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Ex: Salle de Challenge"
            style={{ width: '100%' }}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && hostName && handleCreate()}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Votre nom (Hôte) *
          </label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="Ex: Alice"
            style={{ width: '100%' }}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && roomName && handleCreate()}
          />
        </div>

        {error && (
          <div className="notice error-notice" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="notice" style={{ marginBottom: '16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <strong>ℹ️ En tant qu'hôte :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Vous obtiendrez une clé d'accès à partager</li>
            <li>Vous pourrez suivre la progression de tous les joueurs</li>
            <li>Vous verrez le classement en temps réel</li>
            <li>Vous ne participez pas au jeu, uniquement à la supervision</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} disabled={loading}>
            Retour
          </button>
          <button onClick={handleCreate} disabled={loading || !roomName || !hostName} style={{ flex: 1 }}>
            {loading ? 'Création...' : 'Créer la Salle'}
          </button>
        </div>
      </div>
    </section>
  );
}
