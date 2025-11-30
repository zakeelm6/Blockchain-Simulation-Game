import React, { useState, useEffect } from 'react';

export function ValidatorView({ classCode, participantName, classroom: initialClassroom, onValidationComplete }) {
  const [classroom, setClassroom] = useState(initialClassroom);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Trouver mon groupe
  const myGroup = classroom.groups?.find(g => g.validator === participantName);

  // Groupes à valider (tous sauf le mien)
  const groupsToValidate = classroom.groups?.filter(g => g.id !== myGroup?.id) || [];
  const currentGroup = groupsToValidate[currentGroupIndex];

  // Polling pour détecter la fin
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}`);
        const data = await response.json();

        if (data.ok) {
          setClassroom(data.classroom);

          // Transition vers mining ou résultats
          if (data.classroom.status === 'mining' || data.classroom.status === 'completed') {
            onValidationComplete(data.classroom);
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [classCode, onValidationComplete]);

  async function handleValidation(isValid) {
    if (!currentGroup) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          validatorName: participantName,
          groupId: currentGroup.id,
          isValid
        })
      });

      const data = await response.json();

      if (data.ok) {
        setClassroom(data.classroom);

        // Passer au groupe suivant
        if (currentGroupIndex < groupsToValidate.length - 1) {
          setTimeout(() => {
            setCurrentGroupIndex(currentGroupIndex + 1);
          }, 1500);
        }
      } else {
        setError(data.error || 'Erreur lors de la validation');
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
        <p className="muted">Vous n'êtes pas un validateur</p>
      </section>
    );
  }

  // Vérifier si j'ai terminé toutes mes validations
  const myValidations = classroom.validationResults || {};
  const validatedGroups = groupsToValidate.filter(g =>
    myValidations[g.id]?.validations?.[participantName]
  );

  const allValidated = validatedGroups.length === groupsToValidate.length;

  if (allValidated) {
    return (
      <section className="card">
        <h2>✅ Validation Terminée</h2>
        <p className="muted">Vous avez validé tous les smart contracts</p>

        <div className="success-animation" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="success-checkmark">✓</div>
          <h3 style={{ marginTop: '20px' }}>Toutes vos validations sont terminées !</h3>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>📊 Récapitulatif de vos validations</h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            {groupsToValidate.map((group, idx) => {
              const validation = myValidations[group.id]?.validations?.[participantName];
              const points = myValidations[group.id]?.validatorScores?.[participantName] || 0;

              return (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: validation?.correct ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                    border: `1px solid ${validation?.correct ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)'}`,
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>
                        {group.logo} {group.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                        Validé comme {validation?.isValid ? 'VALIDE' : 'INVALIDE'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: points > 0 ? '#4ade80' : '#f87171'
                      }}>
                        {points > 0 ? '+' : ''}{points} pts
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {validation?.correct ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
            border: '2px solid var(--accent)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '4px' }}>
              TOTAL DE VOS POINTS
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)' }}>
              {validatedGroups.reduce((sum, g) => sum + (myValidations[g.id]?.validatorScores?.[participantName] || 0), 0)}
            </div>
          </div>
        </div>

        <div className="notice" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>
            ⏰ En attente que tous les validateurs terminent...
          </p>
        </div>
      </section>
    );
  }

  if (!currentGroup) {
    return (
      <section className="card">
        <div className="spinner"></div>
        <p className="muted">Chargement...</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>🛡️ Validation des Smart Contracts</h2>
      <p className="muted">En tant que validateur, évaluez les choix des autres équipes</p>

      {/* Progression */}
      <div style={{ marginTop: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
          <span style={{ color: '#94a3b8' }}>Progression</span>
          <span style={{ color: 'var(--accent)', fontWeight: '600' }}>
            {currentGroupIndex + 1} / {groupsToValidate.length}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentGroupIndex + 1) / groupsToValidate.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent), #8b5cf6)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Groupe en cours */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.1))',
        border: '2px solid var(--accent)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '3rem' }}>{currentGroup.logo}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{currentGroup.name}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Membres : {currentGroup.members.join(', ')}
            </p>
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
            SMART CONTRACT CHOISI
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: 'var(--accent)',
            fontWeight: '600'
          }}>
            {currentGroup.contractChoice}
          </div>
        </div>

        <div className="notice" style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
          <strong>⚖️ Votre mission :</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
            Déterminez si ce smart contract est <strong>valide</strong> ou <strong>invalide</strong>.
            <br />
            Points : <span style={{ color: '#4ade80' }}>+5 si correct</span>, <span style={{ color: '#f87171' }}>-3 si incorrect</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="notice error-notice" style={{ marginTop: '16px' }}>
          {error}
        </div>
      )}

      {/* Boutons de validation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={() => handleValidation(false)}
          disabled={loading}
          style={{
            background: 'rgba(248, 113, 113, 0.2)',
            border: '2px solid rgba(248, 113, 113, 0.5)',
            color: '#f87171',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>✗</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>INVALIDE</div>
        </button>

        <button
          onClick={() => handleValidation(true)}
          disabled={loading}
          style={{
            background: 'rgba(74, 222, 128, 0.2)',
            border: '2px solid rgba(74, 222, 128, 0.5)',
            color: '#4ade80',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>✓</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>VALIDE</div>
        </button>
      </div>
    </section>
  );
}
