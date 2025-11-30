import React, { useState, useEffect } from 'react';
import { api } from './apiClient';

const BOT_NAMES = [
  'ValidatorBot-01',
  'CryptoExpert-42',
  'SmartNode-007',
  'BlockMaster-99',
  'ChainGuard-23',
  'LedgerKeeper-56',
  'ByteSage-78',
  'HashWizard-34'
];

export function BotValidator({ playerName, contractId, onValidationComplete }) {
  const [bots, setBots] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [currentBotIndex, setCurrentBotIndex] = useState(-1);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    // Démarrer la validation automatiquement
    startValidation();
  }, [contractId]);

  const startValidation = async () => {
    setIsValidating(true);
    setValidationComplete(false);

    try {
      // Appeler l'API pour obtenir le vrai résultat
      const result = await api.answerSoloContract(playerName, contractId);
      setApiResult(result);

      // Initialiser les bots avec le vrai résultat de l'API
      const totalValidators = 8;
      const validVotes = result.validVotes || 0;

      // Créer les bots : les premiers seront "valides" selon le résultat de l'API
      const initialBots = BOT_NAMES.map((name, idx) => ({
        name,
        isValid: idx < validVotes, // Les N premiers bots valident
        voted: false,
        confidence: Math.floor(Math.random() * 30) + 70 // Confiance entre 70% et 100%
      }));

      // Mélanger aléatoirement les bots pour ne pas avoir tous les "valides" au début
      const shuffledBots = initialBots.sort(() => Math.random() - 0.5);
      setBots(shuffledBots);

      // Simuler le vote progressif des bots un par un
      animateBotVotes(shuffledBots, result);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  };

  const animateBotVotes = (botsList, result) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < botsList.length) {
        setCurrentBotIndex(index);
        setBots(prevBots => {
          const updatedBots = [...prevBots];
          updatedBots[index] = { ...updatedBots[index], voted: true };
          return updatedBots;
        });
        index++;
      } else {
        clearInterval(interval);
        // Tous les bots ont voté
        setTimeout(() => {
          setValidationComplete(true);
          // Si au moins 2 validateurs ont approuvé, afficher l'animation de succès
          const validCount = botsList.filter(b => b.isValid).length;
          if (validCount >= 2) {
            setTimeout(() => {
              setShowSuccessAnimation(true);
            }, 1000);
          }
        }, 800);
      }
    }, 600); // Chaque bot vote toutes les 600ms
  };

  if (!isValidating && bots.length === 0) {
    return (
      <div className="bot-validator">
        <div className="spinner"></div>
        <p className="muted small">Initialisation de la validation...</p>
      </div>
    );
  }

  const validatedCount = bots.filter(b => b.voted && b.isValid).length;
  const totalVoted = bots.filter(b => b.voted).length;

  return (
    <div className="bot-validator">
      <h3>Validation par les 8 validateurs du réseau</h3>
      <p className="muted small">
        {validationComplete
          ? `Validation terminée : ${validatedCount} validateur(s) ont approuvé ce contrat`
          : `Validation en cours... ${totalVoted}/${bots.length} validateurs ont voté`}
      </p>

      <div className="bots-grid">
        {bots.map((bot, index) => (
          <div
            key={bot.name}
            className={`bot-card ${bot.voted ? 'voted' : ''} ${index === currentBotIndex ? 'voting' : ''}`}
          >
            <div className="bot-avatar">🤖</div>
            <div className="bot-name">{bot.name}</div>
            <div className="bot-status">
              {bot.voted ? (
                <span className={bot.isValid ? 'valid' : 'invalid'}>
                  {bot.isValid ? '✅ Valide' : '❌ Invalide'}
                </span>
              ) : (
                <span className="pending">En attente...</span>
              )}
            </div>
            {bot.voted && (
              <div className="bot-confidence">Confiance: {bot.confidence}%</div>
            )}
          </div>
        ))}
      </div>

      {validationComplete && apiResult && (
        <div style={{ marginTop: '20px' }}>
          <div className={`notice ${validatedCount >= 2 ? 'success-notice' : 'error-notice'}`}>
            {apiResult.correct ? (
              <span>✅ Bon choix ! Ce contrat est valide.</span>
            ) : (
              <span>❌ Mauvais choix : ce contrat est invalide.</span>
            )}
          </div>
          <p className="small" style={{ marginTop: '10px' }}>
            <strong>Explication :</strong> {apiResult.explanation}
          </p>
          {validatedCount >= 2 ? (
            showSuccessAnimation ? (
              <div className="success-animation" style={{ marginTop: '16px', textAlign: 'center' }}>
                <div className="success-checkmark">✓</div>
                <p className="small" style={{ marginTop: '10px', fontSize: '1rem', fontWeight: '600' }}>
                  Validation réussie !
                </p>
                <button
                  className="btn-primary"
                  style={{ marginTop: '16px' }}
                  onClick={() => onValidationComplete?.(apiResult)}
                >
                  Passer à l'étape suivante
                </button>
              </div>
            ) : (
              <p className="small muted" style={{ marginTop: '6px' }}>
                ✅ Au moins 2 validateurs ont approuvé...
              </p>
            )
          ) : (
            <p className="small muted" style={{ marginTop: '6px' }}>
              ❌ Pas assez de validateurs (minimum 2 requis). Vous devez choisir un autre contrat.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
