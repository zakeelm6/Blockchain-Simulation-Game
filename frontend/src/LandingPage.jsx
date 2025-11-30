import React from 'react';

export function LandingPage({ onSolo, onClassMode }) {
  return (
    <section className="hero">
      <div className="hero-bg-text">INTRO TO BLOCKCHAIN</div>
      <div className="hero-foreground">
        <div className="hero-kicker">Interactive Challenge Game</div>
        <div className="hero-title">Intro to Blockchain</div>
        <p className="hero-subtitle">
          Un challenge interactif pour découvrir les mécanismes de validation de smart contracts
          à travers une simulation de validation décentralisée par 8 validateurs.
        </p>
        <div className="hero-footer">Decentralizing ideas, connecting minds</div>
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onSolo} style={{ minWidth: '200px' }}>
            🎮 Mode Solo
          </button>
          <button onClick={onClassMode} style={{ minWidth: '200px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', border: 'none' }}>
            🎓 Mode Classe
          </button>
        </div>
      </div>
    </section>
  );
}
