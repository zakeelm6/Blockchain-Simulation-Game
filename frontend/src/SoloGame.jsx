import React, { useState } from 'react';

export function SoloGame({ onProceedToSoloContracts, onBack }) {
  const [playerName, setPlayerName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const trimmedName = playerName.trim();
  const canProceed = Boolean(trimmedName);

  function handlePass() {
    if (!canProceed) return;
    setIsAnimating(true);

    // Animation de 2 secondes avant de passer à la sélection de contrat
    setTimeout(() => {
      onProceedToSoloContracts?.(trimmedName);
    }, 2000);
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

  return (
    <section className="card">
      <h2>Mode Solo – Smart Contract Challenge</h2>
      <p className="muted small">
        Entrez votre nom pour commencer le challenge de validation de smart contracts.
      </p>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Votre nom ou nom d'équipe"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && canProceed && handlePass()}
          style={{ flex: 1 }}
        />
        <button type="button" disabled={!canProceed} onClick={handlePass}>
          Commencer
        </button>
        {onBack && (
          <button className="btn-outline" onClick={onBack}>Retour</button>
        )}
      </div>
    </section>
  );
}
