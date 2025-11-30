import React, { useState, useEffect } from 'react';

export function ParticipantWaiting({ classCode, participantName, classroom: initialClassroom, onGameStarted }) {
  const [classroom, setClassroom] = useState(initialClassroom);

  // Polling pour détecter le démarrage
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}`);
        const data = await response.json();

        if (data.ok) {
          setClassroom(data.classroom);

          // Si le jeu a démarré, notifier le parent
          if (data.classroom.status === 'voting') {
            onGameStarted(data.classroom);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
      }
    }, 2000); // Mise à jour toutes les 2 secondes

    return () => clearInterval(interval);
  }, [classCode, onGameStarted]);

  return (
    <section className="card">
      <h2>⏳ En attente du démarrage...</h2>
      <p className="muted">Le responsable va bientôt démarrer la classe</p>

      {/* Animation de chargement */}
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="spinner" style={{ marginBottom: '20px' }}></div>
        <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
          Bienvenue <strong style={{ color: 'var(--accent)' }}>{participantName}</strong> !
        </p>
        <p className="muted small">
          Vous avez rejoint la classe <strong>{classroom.name}</strong>
        </p>
      </div>

      {/* Informations */}
      <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', fontSize: '0.9rem' }}>
          <div style={{ color: '#94a3b8' }}>Code de classe:</div>
          <div style={{ color: 'var(--accent)', fontWeight: '700', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            {classCode}
          </div>

          <div style={{ color: '#94a3b8' }}>Responsable:</div>
          <div style={{ color: '#38bdf8' }}>{classroom.createdBy}</div>

          <div style={{ color: '#94a3b8' }}>Participants:</div>
          <div style={{ color: '#fbbf24', fontWeight: '600' }}>
            {classroom.participants.length} {classroom.participants.length >= 4 ? '✓' : '(en attente...)'}
          </div>

          <div style={{ color: '#94a3b8' }}>Groupes formés:</div>
          <div style={{ color: '#a855f7', fontWeight: '600' }}>
            {Math.floor(classroom.participants.length / 4)} groupe(s)
          </div>
        </div>
      </div>

      {/* Liste des participants */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', color: '#94a3b8' }}>
          👥 Participants dans la classe
        </h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'grid', gap: '6px' }}>
          {classroom.participants.map((p, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                background: p.name === participantName ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.3)',
                border: p.name === participantName ? '1px solid var(--accent)' : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.85rem'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: p.name === participantName ? 'var(--accent)' : 'rgba(148, 163, 184, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: p.name === participantName ? '#0f172a' : '#fff',
                fontWeight: '700',
                fontSize: '0.75rem'
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1, fontWeight: p.name === participantName ? '600' : '400' }}>
                {p.name}
                {p.name === participantName && (
                  <span style={{ marginLeft: '8px', color: 'var(--accent)', fontSize: '0.75rem' }}>(Vous)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message d'attente */}
      <div className="notice success-notice" style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ margin: 0 }}>
          ⏰ En attente que le responsable démarre la classe...
        </p>
      </div>
    </section>
  );
}
