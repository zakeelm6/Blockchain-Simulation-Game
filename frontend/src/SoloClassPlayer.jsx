import React, { useState, useEffect } from 'react';

export function SoloClassPlayer({ classCode, participantName, onComplete }) {
  const [step, setStep] = useState('loading'); // 'loading' | 'contract' | 'validation-result' | 'mining' | 'completed' | 'eliminated' | 'waiting-dao'
  const [classroom, setClassroom] = useState(null);
  const [progress, setProgress] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mining state
  const [nonce, setNonce] = useState('');
  const [miningFeedback, setMiningFeedback] = useState('');

  // Initialiser le jeu
  useEffect(() => {
    async function initGame() {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}/solo/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerName: participantName })
        });

        const data = await response.json();

        if (data.ok) {
          setClassroom(data.classroom);
          setProgress(data.progress);
          setContracts(data.contracts || []);
          setStep(data.progress.status);
        } else {
          setError(data.error || 'Erreur lors de l\'initialisation');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error(err);
      }
    }

    initGame();
  }, [classCode, participantName]);

  // Polling pour détecter les changements de statut
  useEffect(() => {
    if (!progress) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}`);
        const data = await response.json();

        if (data.ok) {
          setClassroom(data.classroom);
          const updatedProgress = data.classroom.playerProgress?.[participantName];

          if (updatedProgress) {
            setProgress(updatedProgress);

            // Transition vers le vote DAO
            if (data.classroom.status === 'dao-voting' && updatedProgress.status === 'completed') {
              onComplete(data.classroom);
            }

            // Afficher résultats si terminé
            if (data.classroom.status === 'completed') {
              onComplete(data.classroom);
            }
          }
        }
      } catch (err) {
        console.error('Erreur polling:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [classCode, participantName, progress, onComplete]);

  async function handleChooseContract(contractId) {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode}/solo/choose-contract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: participantName, contractId })
      });

      const data = await response.json();

      if (data.ok) {
        setProgress(data.progress);
        setClassroom(data.classroom);
        setStep('validation-result');

        // Transition automatique après 3 secondes
        setTimeout(() => {
          if (data.passed) {
            setStep('mining');
          } else {
            setStep('eliminated');
          }
        }, 3000);
      } else {
        setError(data.error || 'Erreur lors du choix');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMiningAttempt() {
    if (!nonce.trim() || nonce < 0 || nonce > 20) {
      setError('Veuillez entrer un nombre entre 0 et 20');
      return;
    }

    setLoading(true);
    setError('');
    setMiningFeedback('');

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode}/solo/mine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: participantName, nonce: parseInt(nonce) })
      });

      const data = await response.json();

      if (data.ok) {
        setProgress(data.progress);
        setClassroom(data.classroom);

        if (data.eliminated) {
          setMiningFeedback('❌ Tentatives épuisées. Vous êtes éliminé.');
          setTimeout(() => setStep('eliminated'), 2000);
        } else if (data.correct) {
          setMiningFeedback(`🎉 TROUVÉ ! Le nonce était ${nonce}.`);
          setTimeout(() => setStep('completed'), 2000);
        } else {
          setMiningFeedback(`❌ Incorrect. Tentative ${data.attempts}/10`);
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

  if (step === 'loading' || !progress) {
    return (
      <section className="card">
        <div className="spinner"></div>
        <p className="muted">Chargement...</p>
      </section>
    );
  }

  // Étape: Choix du contrat
  if (step === 'contract') {
    return (
      <section className="card">
        <h2>📝 Choix du Smart Contract</h2>
        <p className="muted">Choisissez le contrat VALIDE parmi les deux proposés</p>

        <div className="notice" style={{ marginTop: '20px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
          <strong>⚠️ Important :</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
            8 validateurs bots vont évaluer votre choix. Vous devez obtenir au moins 2 validations pour continuer.
          </p>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
          {contracts.map((contract, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px',
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '12px'
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--accent)' }}>
                {contract.title}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                {contract.description}
              </p>
              <pre style={{
                background: 'rgba(0,0,0,0.5)',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.8rem',
                marginBottom: '16px'
              }}>
                <code>{contract.code}</code>
              </pre>
              <button
                onClick={() => handleChooseContract(contract.id)}
                disabled={loading}
                style={{ width: '100%' }}
              >
                Choisir ce contrat
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="notice error-notice" style={{ marginTop: '16px' }}>
            {error}
          </div>
        )}
      </section>
    );
  }

  // Étape: Résultat de la validation
  if (step === 'validation-result') {
    const passed = progress.validationScore >= 2;
    return (
      <section className="card">
        <h2>🤖 Résultat de la Validation</h2>
        <p className="muted">8 validateurs bots ont évalué votre choix</p>

        <div style={{
          marginTop: '32px',
          padding: '32px',
          background: passed ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
          border: `2px solid ${passed ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)'}`,
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
            {passed ? '✅' : '❌'}
          </div>
          <h3 style={{ margin: '0 0 8px 0', color: passed ? '#4ade80' : '#f87171' }}>
            {passed ? 'VALIDÉ !' : 'NON VALIDÉ'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            {progress.validationScore} / 8 validateurs ont approuvé votre choix
          </p>
          {progress.contractCorrect && (
            <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#4ade80' }}>
              ✓ Vous avez choisi un contrat valide (+10 points)
            </p>
          )}
        </div>

        <div className="notice" style={{ marginTop: '20px', textAlign: 'center' }}>
          {passed ? (
            <p style={{ margin: 0 }}>⏰ Transition vers le mining...</p>
          ) : (
            <p style={{ margin: 0 }}>💔 Vous avez été éliminé</p>
          )}
        </div>
      </section>
    );
  }

  // Étape: Mining
  if (step === 'mining') {
    return (
      <section className="card">
        <h2>⛏️ Mining Challenge</h2>
        <p className="muted">Trouvez le nonce correct pour valider le bloc</p>

        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
          border: '2px solid rgba(251, 191, 36, 0.5)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                TENTATIVES
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
                {progress.miningAttempts}/10
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                SCORE ACTUEL
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>
                {progress.totalScore}
              </div>
            </div>
          </div>
        </div>

        <div className="notice" style={{ marginTop: '20px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>ℹ️ Règles :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Le nonce est un nombre entre 0 et 20</li>
            <li>Vous avez 10 tentatives maximum</li>
            <li>Points: ≤3 tentatives=20pts, ≤6 tentatives=10pts, autres=5pts</li>
          </ul>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <input
            type="number"
            min="0"
            max="20"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            placeholder="Entrez un nombre (0-20)"
            style={{ flex: 1, fontSize: '1.1rem', textAlign: 'center' }}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleMiningAttempt()}
          />
          <button onClick={handleMiningAttempt} disabled={loading || !nonce} style={{ minWidth: '120px' }}>
            {loading ? 'Test...' : 'Tester'}
          </button>
        </div>

        {miningFeedback && (
          <div className={miningFeedback.includes('TROUVÉ') ? 'notice success-notice' : 'notice'} style={{ marginTop: '12px', textAlign: 'center' }}>
            {miningFeedback}
          </div>
        )}

        {error && (
          <div className="notice error-notice" style={{ marginTop: '12px' }}>
            {error}
          </div>
        )}
      </section>
    );
  }

  // Étape: Terminé
  if (step === 'completed') {
    return (
      <section className="card">
        <div className="success-animation" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="success-checkmark">✓</div>
          <h2 style={{ marginTop: '20px', color: '#4ade80' }}>Challenge Terminé !</h2>
          <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
            Vous avez complété toutes les étapes
          </p>
        </div>

        <div style={{
          marginTop: '24px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
          border: '2px solid var(--accent)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Votre Performance</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                CONTRAT
              </div>
              <div style={{ fontSize: '1.2rem', color: progress.contractCorrect ? '#4ade80' : '#f87171' }}>
                {progress.contractCorrect ? '✓' : '✗'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                MINING
              </div>
              <div style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>
                {progress.miningAttempts} essais
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                SCORE
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>
                {progress.totalScore}
              </div>
            </div>
          </div>
        </div>

        <div className="notice" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>
            ⏰ En attente du vote DAO final...
          </p>
        </div>
      </section>
    );
  }

  // Étape: Éliminé
  if (step === 'eliminated') {
    return (
      <section className="card">
        <h2>❌ Vous avez été éliminé</h2>
        <p className="muted">{progress.eliminatedReason}</p>

        <div style={{
          marginTop: '32px',
          padding: '32px',
          background: 'rgba(248, 113, 113, 0.1)',
          border: '2px solid rgba(248, 113, 113, 0.4)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😔</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#f87171' }}>Game Over</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            Vous ne pouvez pas continuer, mais votre progression a été sauvegardée
          </p>
        </div>

        <div style={{
          marginTop: '24px',
          padding: '20px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Votre progression</h4>

          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Contrat choisi:</span>
              <span style={{ color: progress.contractCorrect ? '#4ade80' : '#f87171' }}>
                {progress.contractCorrect ? '✓ Valide' : '✗ Invalide'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Validateurs:</span>
              <span>{progress.validationScore}/8</span>
            </div>
            {progress.miningAttempts > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Tentatives mining:</span>
                <span>{progress.miningAttempts}/10</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <span style={{ fontWeight: '600' }}>Score final:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent)' }}>{progress.totalScore}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
