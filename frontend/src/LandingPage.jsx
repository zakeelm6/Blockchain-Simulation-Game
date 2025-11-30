import React from 'react';

export function LandingPage({ onSolo }) {
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
        <div style={{ marginTop: '12px' }}>
          <button onClick={onSolo}>Commencer le challenge</button>
        </div>
      </div>
    </section>
  );
}
