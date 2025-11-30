import React, { useEffect, useState } from 'react';
import { api } from './apiClient';
import { BotValidator } from './BotValidator';

export function SoloContractChoice({ playerName, onBack, onProceedToActivity1 }) {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showBotValidation, setShowBotValidation] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    setError('');
    setSelectedContract(null);
    setShowBotValidation(false);
    setLoading(true);
    try {
      const data = await api.getSoloContractsPair();
      setContracts(data.contracts || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleContractSelect(contract) {
    setSelectedContract(contract);
    setShowBotValidation(true);
  }

  function handleValidationComplete(botResult) {
    // L'utilisateur a cliqué sur "Passer à l'étape suivante"
    // Passer les résultats de validation avec le nombre de votes valides
    if (botResult && botResult.validVotes >= 2) {
      onProceedToActivity1({
        correct: botResult.correct,
        validVotes: botResult.validVotes
      });
    }
  }

  // Vue de validation par les bots
  if (showBotValidation && selectedContract) {
    return (
      <section className="card">
        <h2>Validation en cours...</h2>
        <div className="contract-card" style={{ marginBottom: '20px' }}>
          <h3>{selectedContract.title}</h3>
          <p className="muted small">{selectedContract.description}</p>
          <div className="code-block">
            <pre><code>{selectedContract.code}</code></pre>
          </div>
        </div>

        <BotValidator
          playerName={playerName}
          contractId={selectedContract.id}
          onValidationComplete={handleValidationComplete}
        />

        <div className="button-group" style={{ marginTop: '20px' }}>
          <button
            className="btn-outline"
            onClick={() => {
              setSelectedContract(null);
              setShowBotValidation(false);
              setError('');
            }}
          >
            Annuler
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Mode Solo – Smart Contract Challenge</h2>
      <p className="muted small">
        {playerName ? `Bonjour ${playerName}. Choisissez le smart contract que vous jugez valide parmi les propositions ci-dessous.`
          : 'Choisissez un smart contract parmi les deux proposées.'}
      </p>

      {error && <div className="error">{error}</div>}
      {loading && <div className="muted small">Chargement…</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', marginTop: '10px' }}>
        {contracts.map(contract => (
          <div key={contract.id} className="contract-card">
            <h3>{contract.title}</h3>
            <p className="muted small">{contract.description}</p>
            <div className="code-block">
              <pre><code>{contract.code}</code></pre>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleContractSelect(contract)}
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Vérifier ce contrat'}
            </button>
          </div>
        ))}
      </div>

      {onBack && (
        <div style={{ marginTop: '10px' }}>
          <button className="btn-outline" onClick={onBack}>Retour</button>
        </div>
      )}
    </section>
  );
}
