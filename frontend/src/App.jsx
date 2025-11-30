import React, { useState } from 'react';
import { SoloGame } from './SoloGame';
import { SoloContractChoice } from './SoloContractChoice';
import { MiningChallenge } from './MiningChallenge';
import { VotingChallenge } from './VotingChallenge';
import { LandingPage } from './LandingPage';

function App() {
  const [step, setStep] = useState('landing'); // 'landing' | 'solo' | 'soloContracts' | 'mining' | 'voting'
  const [soloPlayerName, setSoloPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState(0);

  function goToSolo() {
    setStep('solo');
    setPlayerScore(0); // Réinitialiser le score
  }

  function goToLanding() {
    setStep('landing');
  }

  function startSoloContracts(name) {
    setSoloPlayerName(name);
    setStep('soloContracts');
  }

  function handleValidationComplete(validationResult) {
    // Points pour la validation de smart contract
    // Bon choix = +10, Mauvais choix = +3, Validateurs = +2 par validateur
    let points = 0;
    if (validationResult.correct) {
      points += 10; // Bon choix
    } else {
      points += 3; // Mauvais choix mais essayé
    }
    points += (validationResult.validVotes || 0) * 2; // +2 par validateur

    setPlayerScore(prev => prev + points);
    setStep('mining');
  }

  function handleMiningComplete(miningResult) {
    // Points pour le mining
    // 1ère tentative = +20, 2-3 tentatives = +15, 4-6 = +10, 7-10 = +5
    let points = 0;
    if (miningResult.attempts === 1) {
      points = 20;
    } else if (miningResult.attempts <= 3) {
      points = 15;
    } else if (miningResult.attempts <= 6) {
      points = 10;
    } else {
      points = 5;
    }

    setPlayerScore(prev => prev + points);
    setStep('voting');
  }

  function handleVotingComplete(finalData) {
    // Afficher les résultats finaux
    alert(`🎉 Challenge terminé ${soloPlayerName} !\n\n🏆 Classement final : #${finalData.rank || 'N/A'}\n💰 Score final : ${finalData.finalScore} points\n\nMerci d'avoir participé !`);
    goToLanding();
  }

  console.log('App step', step);
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-brand">
          <div className="app-logo">IBC</div>
          <div className="app-title">
            <span className="app-title-main">Intro to Blockchain</span>
            <span className="app-title-sub">Decentralizing ideas, connecting minds</span>
          </div>
        </div>
        <nav className="app-nav" />
      </header>

      <main className="app-main">
        {step === 'landing' && (
          <LandingPage onSolo={goToSolo} />
        )}

        {step === 'solo' && (
          <SoloGame
            onBack={goToLanding}
            onProceedToSoloContracts={startSoloContracts}
          />
        )}

        {step === 'soloContracts' && (
          <SoloContractChoice
            playerName={soloPlayerName}
            onBack={goToSolo}
            onProceedToActivity1={handleValidationComplete}
          />
        )}

        {step === 'mining' && (
          <MiningChallenge
            playerName={soloPlayerName}
            onComplete={handleMiningComplete}
            onBack={() => setStep('soloContracts')}
          />
        )}

        {step === 'voting' && (
          <VotingChallenge
            playerName={soloPlayerName}
            playerScore={playerScore}
            onComplete={handleVotingComplete}
            onBack={() => setStep('mining')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
