import React, { useState } from 'react';

export function SoloRoomJoin({ onJoined, onBack }) {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleJoin() {
    if (!roomCode.trim() || !playerName.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/solo-room/${roomCode.trim().toUpperCase()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim()
        })
      });

      const data = await response.json();

      if (data.ok) {
        onJoined(roomCode.trim().toUpperCase(), playerName.trim(), data.room);
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
      <h2>🎮 Rejoindre une Salle</h2>
      <p className="muted">Entrez la clé fournie par l'hôte</p>

      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Clé de la salle
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Ex: ABC123"
            style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.2rem', fontFamily: 'monospace' }}
            maxLength={6}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && playerName && handleJoin()}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Votre nom
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ex: Bob"
            style={{ width: '100%' }}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && roomCode && handleJoin()}
          />
        </div>

        {error && (
          <div className="notice error-notice" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="notice" style={{ marginBottom: '16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>ℹ️ En tant que joueur :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Vous jouez en mode solo individuel</li>
            <li>8 bots valident vos choix automatiquement</li>
            <li>Votre progression est suivie en temps réel</li>
            <li>Comparez votre score avec les autres joueurs</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} disabled={loading}>
            Retour
          </button>
          <button onClick={handleJoin} disabled={loading || !roomCode || !playerName} style={{ flex: 1 }}>
            {loading ? 'Connexion...' : 'Rejoindre'}
          </button>
        </div>
      </div>
    </section>
  );
}
