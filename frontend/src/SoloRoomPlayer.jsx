import React, { useState, useEffect } from 'react';
import { SoloContractChoice } from './SoloContractChoice';

export function SoloRoomPlayer({ roomCode, playerName, onBack }) {
  const [step, setStep] = useState('ready'); // 'ready' | 'playing' | 'finished'
  const [isAnimating, setIsAnimating] = useState(false);

  async function handleStart() {
    setIsAnimating(true);

    // Animation de 2 secondes avant de démarrer
    setTimeout(() => {
      setStep('playing');
      setIsAnimating(false);
    }, 2000);
  }

  async function updatePlayerProgress(currentStepNum, score, status) {
    try {
      await fetch(`http://localhost:4000/api/solo-room/${roomCode}/player/${playerName}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: currentStepNum,
          score: score,
          status: status,
          action: {
            type: 'progress',
            step: currentStepNum,
            score: score
          }
        })
      });
    } catch (err) {
      console.error('Erreur mise à jour:', err);
    }
  }

  function handleContractComplete(finalScore) {
    // Marquer le joueur comme terminé
    updatePlayerProgress(10, finalScore, 'finished');
    setStep('finished');
  }

  if (isAnimating) {
    return (
      <section className="card">
        <div className="welcome-animation">
          <div className="spinner"></div>
          <h2 style={{ marginTop: '20px' }}>Bienvenue {playerName} !</h2>
          <p className="muted small">Préparation de votre challenge...</p>
        </div>
      </section>
    );
  }

  if (step === 'ready') {
    return (
      <section className="card">
        <h2>🎮 Mode Solo en Salle</h2>
        <p className="muted">Prêt à commencer le challenge, {playerName} ?</p>

        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
          border: '2px solid rgba(139, 92, 246, 0.5)',
          borderRadius: '12px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>📋 Règles du Challenge</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
            <li>Vous allez choisir un smart contract parmi 2 options</li>
            <li>8 bots vont valider automatiquement votre choix</li>
            <li>Minimum 2 validations requises pour continuer</li>
            <li>Vous avez 10 tentatives de mining (nonce 0-20)</li>
            <li>Votre progression est suivie en temps réel</li>
          </ul>
        </div>

        <div className="notice" style={{ marginTop: '24px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>💡 Conseil :</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
            Prenez le temps de bien analyser chaque smart contract avant de faire votre choix !
          </p>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button onClick={onBack}>
            Quitter
          </button>
          <button onClick={handleStart} style={{ flex: 1, background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
            🚀 Commencer le Challenge
          </button>
        </div>
      </section>
    );
  }

  if (step === 'playing') {
    return (
      <SoloContractChoice
        playerName={playerName}
        onComplete={handleContractComplete}
        onProgressUpdate={updatePlayerProgress}
        roomCode={roomCode}
      />
    );
  }

  if (step === 'finished') {
    return (
      <section className="card">
        <h2>🎉 Challenge Terminé !</h2>
        <p className="muted">Félicitations {playerName}, vous avez terminé le challenge !</p>

        <div style={{
          marginTop: '32px',
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
          border: '2px solid rgba(251, 191, 36, 0.5)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏆</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
            Bravo !
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            Votre score et votre classement sont visibles sur le tableau de bord de l'hôte
          </p>
        </div>

        <div className="notice" style={{ marginTop: '24px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>ℹ️ Prochaines étapes :</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
            Vous pouvez maintenant consulter le classement avec les autres joueurs ou quitter la salle.
          </p>
        </div>

        <button onClick={onBack} style={{ marginTop: '24px', width: '100%' }}>
          Retour au Menu
        </button>
      </section>
    );
  }

  return null;
}
