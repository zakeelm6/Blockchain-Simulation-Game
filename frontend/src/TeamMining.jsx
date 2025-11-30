import React, { useState, useEffect } from 'react';

export function TeamMining({ classCode, participantName, classroom: initialClassroom, onMiningComplete }) {
  const [classroom, setClassroom] = useState(initialClassroom);
  const [nonce, setNonce] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myAttempts, setMyAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Trouver mon groupe
  const myGroup = classroom.groups?.find(g =>
    g.members.includes(participantName) || g.validator === participantName
  );

  const isQualified = myGroup && classroom.qualifiedGroups?.includes(myGroup.id);
  const miningResult = classroom.miningResults?.[myGroup?.id];

  // Polling pour mettre à jour l'état
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}`);
        const data = await response.json();

        if (data.ok) {
          setClassroom(data.classroom);

          // Mettre à jour mes tentatives
          const result = data.classroom.miningResults?.[myGroup?.id];
          if (result) {
            setMyAttempts(result.attempts[participantName] || 0);
          }

          // Si on passe au vote DAO ou si c'est terminé
          if (data.classroom.status === 'dao' || data.classroom.status === 'completed') {
            onMiningComplete(data.classroom);
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [classCode, participantName, myGroup?.id, onMiningComplete]);

  async function handleTry() {
    if (!nonce.trim() || nonce < 0 || nonce > 100) {
      setError('Veuillez entrer un nombre entre 0 et 100');
      return;
    }

    setLoading(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode}/mine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: participantName,
          nonce: parseInt(nonce)
        })
      });

      const data = await response.json();

      if (data.ok) {
        setClassroom(data.classroom);
        setMyAttempts(data.attempts);

        if (data.correct) {
          setFeedback(`🎉 TROUVÉ ! Le nonce était ${nonce}. Votre équipe gagne ${data.points} points !`);
        } else if (data.alreadySolved) {
          setFeedback(`✅ Votre équipe a déjà trouvé le nonce (par ${data.solvedBy})`);
        } else {
          setFeedback(`❌ Incorrect. Tentative ${data.attempts}/10`);
        }

        setNonce('');
      } else {
        setError(data.error || 'Erreur lors de la tentative');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!myGroup) {
    return (
      <section className="card">
        <p className="muted">Erreur: Groupe non trouvé</p>
      </section>
    );
  }

  // Équipe non qualifiée
  if (!isQualified) {
    return (
      <section className="card">
        <h2>❌ Équipe Non Qualifiée</h2>
        <p className="muted">Votre équipe n'a pas été sélectionnée pour la phase de mining</p>

        <div style={{
          marginTop: '24px',
          padding: '24px',
          background: 'rgba(248, 113, 113, 0.1)',
          border: '2px solid rgba(248, 113, 113, 0.4)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>😔</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#f87171' }}>Désolé, {myGroup.name}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            Seules les meilleures équipes (top 20%) sont qualifiées pour le mining.
          </p>
        </div>

        <div className="notice" style={{ marginTop: '20px' }}>
          <strong>📊 Classement actuel :</strong>
          <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
            {classroom.groups
              .sort((a, b) => b.score - a.score)
              .map((g, idx) => (
                <div
                  key={g.id}
                  style={{
                    padding: '8px 12px',
                    background: g.id === myGroup.id ? 'rgba(248, 113, 113, 0.1)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${g.id === myGroup.id ? 'rgba(248, 113, 113, 0.4)' : 'rgba(148, 163, 184, 0.2)'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>
                    #{idx + 1} {g.logo} {g.name}
                    {g.id === myGroup.id && <span style={{ marginLeft: '8px', color: '#f87171' }}>(Votre équipe)</span>}
                  </span>
                  <span style={{ fontWeight: '600', color: 'var(--accent)' }}>{g.score} pts</span>
                </div>
              ))}
          </div>
        </div>

        <div className="notice success-notice" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>
            ⏰ En attente que les équipes qualifiées terminent le mining...
          </p>
        </div>
      </section>
    );
  }

  // Équipe qualifiée - Interface de mining
  const teamMembers = [...myGroup.members, myGroup.validator];
  const teamAttempts = teamMembers.reduce((sum, m) => sum + (miningResult?.attempts[m] || 0), 0);
  const maxTeamAttempts = teamMembers.length * 10;
  const solved = miningResult?.solved || false;

  return (
    <section className="card">
      <h2>⛏️ Mining en Équipe</h2>
      <p className="muted">Votre équipe est qualifiée ! Trouvez le nonce collaborativement</p>

      {/* Info de l'équipe */}
      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
        border: '2px solid rgba(251, 191, 36, 0.5)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '3rem' }}>{myGroup.logo}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#fbbf24' }}>
              {myGroup.name} - QUALIFIÉE !
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Score actuel : {myGroup.score} points
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginTop: '12px'
        }}>
          <div style={{
            padding: '12px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              VOS TENTATIVES
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: solved ? '#4ade80' : 'var(--accent)' }}>
              {myAttempts}/10
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              ÉQUIPE TOTALE
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: solved ? '#4ade80' : '#fbbf24' }}>
              {teamAttempts}/{maxTeamAttempts}
            </div>
          </div>
        </div>
      </div>

      {/* Résultat si trouvé */}
      {solved && (
        <div className="success-animation" style={{ marginTop: '20px', textAlign: 'center', padding: '24px', background: 'rgba(74, 222, 128, 0.1)', border: '2px solid rgba(74, 222, 128, 0.4)', borderRadius: '12px' }}>
          <div className="success-checkmark">✓</div>
          <h3 style={{ marginTop: '16px', color: '#4ade80' }}>
            NONCE TROUVÉ PAR {miningResult.solvedBy.toUpperCase()} !
          </h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
            Votre équipe a gagné {myGroup.miningPoints || 0} points
          </p>
        </div>
      )}

      {/* Zone de tentative */}
      {!solved && myAttempts < 10 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>🎯 Trouvez le Nonce (0-100)</h3>

          <div className="notice" style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <strong>ℹ️ Comment ça marche :</strong>
            <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
              <li>Chaque membre a <strong>10 tentatives</strong> personnelles</li>
              <li>L'équipe a <strong>{maxTeamAttempts} tentatives</strong> au total</li>
              <li>Si un membre trouve, toute l'équipe gagne</li>
              <li>Points selon le rang : 1er=30pts, 2e=20pts, 3e=15pts, 4e=10pts, autres=5pts</li>
            </ul>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <input
              type="number"
              min="0"
              max="100"
              value={nonce}
              onChange={(e) => setNonce(e.target.value)}
              placeholder="Entrez un nombre (0-100)"
              style={{ flex: 1, fontSize: '1.1rem', textAlign: 'center' }}
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleTry()}
            />
            <button onClick={handleTry} disabled={loading || !nonce} style={{ minWidth: '120px' }}>
              {loading ? 'Test...' : 'Tester'}
            </button>
          </div>

          {feedback && (
            <div className={feedback.includes('TROUVÉ') ? 'notice success-notice' : 'notice'} style={{ marginTop: '12px', textAlign: 'center' }}>
              {feedback}
            </div>
          )}

          {error && (
            <div className="notice error-notice" style={{ marginTop: '12px' }}>
              {error}
            </div>
          )}
        </div>
      )}

      {/* Tentatives épuisées */}
      {!solved && myAttempts >= 10 && (
        <div className="notice" style={{
          marginTop: '20px',
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            ⏰ Vous avez épuisé vos 10 tentatives. En attente de vos coéquipiers...
          </p>
        </div>
      )}

      {/* État de l'équipe */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>👥 État de l'équipe</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {teamMembers.map((member, idx) => {
            const memberAttempts = miningResult?.attempts[member] || 0;
            const isMe = member === participantName;

            return (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  background: isMe ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${isMe ? 'var(--accent)' : 'rgba(148, 163, 184, 0.2)'}`,
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem'
                }}
              >
                <span style={{ fontWeight: isMe ? '600' : '400' }}>
                  {member}
                  {isMe && <span style={{ marginLeft: '8px', color: 'var(--accent)', fontSize: '0.75rem' }}>(Vous)</span>}
                </span>
                <span style={{
                  fontWeight: '600',
                  color: memberAttempts >= 10 ? '#f87171' : memberAttempts > 0 ? '#fbbf24' : '#94a3b8'
                }}>
                  {memberAttempts}/10
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
