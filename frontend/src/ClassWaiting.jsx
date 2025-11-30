import React, { useState, useEffect } from 'react';

export function ClassWaiting({ classCode, classroom: initialClassroom, onStart, onBack }) {
  const [classroom, setClassroom] = useState(initialClassroom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Polling pour mettre à jour la liste des participants
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}`);
        const data = await response.json();
        if (data.ok) {
          setClassroom(data.classroom);
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
      }
    }, 2000); // Mise à jour toutes les 2 secondes

    return () => clearInterval(interval);
  }, [classCode]);

  async function handleStart() {
    if (classroom.participants.length < 4) {
      setError('Minimum 4 participants requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.ok) {
        onStart(data.classroom);
      } else {
        setError(data.error || 'Erreur lors du démarrage');
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
      <h2>⏳ Salle d'Attente</h2>
      <p className="muted">Partagez le code ci-dessous avec vos participants</p>

      {/* Code de classe */}
      <div style={{
        marginTop: '24px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
        border: '2px solid var(--accent)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>
          CODE DE LA CLASSE
        </div>
        <div style={{
          fontSize: '3rem',
          fontWeight: '700',
          color: 'var(--accent)',
          letterSpacing: '0.1em',
          fontFamily: 'monospace'
        }}>
          {classCode}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
          Les participants peuvent rejoindre avec ce code
        </div>
      </div>

      {/* Informations de la classe */}
      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', fontSize: '0.9rem' }}>
          <div style={{ color: '#94a3b8' }}>Nom de la classe:</div>
          <div style={{ color: 'var(--accent)', fontWeight: '600' }}>{classroom.name}</div>

          <div style={{ color: '#94a3b8' }}>Responsable:</div>
          <div style={{ color: '#38bdf8' }}>{classroom.createdBy}</div>

          <div style={{ color: '#94a3b8' }}>Participants:</div>
          <div style={{ color: '#fbbf24', fontWeight: '600' }}>
            {classroom.participants.length} {classroom.participants.length >= 4 ? '✓' : '(min. 4)'}
          </div>
        </div>
      </div>

      {/* Liste des participants */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>
          👥 Participants ({classroom.participants.length})
        </h3>

        {classroom.participants.length === 0 ? (
          <div className="notice" style={{ textAlign: 'center', padding: '24px' }}>
            <p className="muted">En attente de participants...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {classroom.participants.map((p, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Rejoint {new Date(p.joinedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informations sur la formation des groupes */}
      {classroom.participants.length > 0 && (
        <div className="notice" style={{ marginTop: '20px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <strong>📊 Formation des groupes :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
            <li>4 participants par groupe</li>
            <li>3 votants + 1 validateur par groupe</li>
            <li>{Math.floor(classroom.participants.length / 4)} groupe(s) seront formés</li>
            <li>{classroom.participants.length % 4} participant(s) en attente (si &lt; 4)</li>
          </ul>
        </div>
      )}

      {error && (
        <div className="notice error-notice" style={{ marginTop: '16px' }}>
          {error}
        </div>
      )}

      {/* Boutons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} disabled={loading}>
          Annuler
        </button>
        <button
          onClick={handleStart}
          disabled={loading || classroom.participants.length < 4}
          style={{ flex: 1 }}
        >
          {loading ? 'Démarrage...' : `Démarrer avec ${classroom.participants.length} participants`}
        </button>
      </div>
    </section>
  );
}
