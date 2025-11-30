import React, { useState, useEffect } from 'react';

const BLOCKCHAIN_QUESTIONS = [
  {
    id: 1,
    question: "Qu'est-ce qu'un hash en blockchain ?",
    options: [
      "Une fonction mathématique qui transforme des données en une empreinte unique",
      "Un type de cryptomonnaie",
      "Un nœud du réseau",
      "Un portefeuille numérique"
    ],
    correctIndex: 0
  },
  {
    id: 2,
    question: "Que signifie 'Proof of Work' ?",
    options: [
      "Preuve d'identité",
      "Preuve de travail (calculs intensifs pour valider un bloc)",
      "Preuve de propriété",
      "Preuve de richesse"
    ],
    correctIndex: 1
  },
  {
    id: 3,
    question: "Qu'est-ce qu'un nonce dans le minage ?",
    options: [
      "Un numéro de transaction",
      "Un nombre arbitraire utilisé pour trouver un hash valide",
      "Un type de token",
      "Une adresse de portefeuille"
    ],
    correctIndex: 1
  }
];

// Fonction pour générer un indice basé sur le nonce réel
function generateHint(nonce) {
  const hints = [];

  // Indice sur la plage
  if (nonce < 5) {
    hints.push("Le nonce est inférieur à 5");
  } else if (nonce < 10) {
    hints.push("Le nonce est entre 5 et 9");
  } else if (nonce < 15) {
    hints.push("Le nonce est entre 10 et 14");
  } else {
    hints.push("Le nonce est entre 15 et 20");
  }

  // Indice sur parité
  if (nonce % 2 === 0) {
    hints.push("Le nonce est un nombre pair");
  } else {
    hints.push("Le nonce est un nombre impair");
  }

  // Indice sur divisibilité
  if (nonce % 5 === 0 && nonce !== 0) {
    hints.push("Le nonce est divisible par 5");
  } else if (nonce % 3 === 0 && nonce !== 0) {
    hints.push("Le nonce est divisible par 3");
  }

  // Retourner un indice aléatoire parmi les vrais indices
  return hints[Math.floor(Math.random() * hints.length)];
}

export function MiningChallenge({ playerName, onComplete, onBack }) {
  const [blockData, setBlockData] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [nonceInput, setNonceInput] = useState('');
  const [attempts, setAttempts] = useState(10);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [targetNonce, setTargetNonce] = useState(0);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [hint, setHint] = useState('');

  useEffect(() => {
    initializeChallenge();
  }, []);

  function initializeChallenge() {
    // Choisir une question aléatoire
    const randomQuestion = BLOCKCHAIN_QUESTIONS[Math.floor(Math.random() * BLOCKCHAIN_QUESTIONS.length)];
    setQuestion(randomQuestion);

    // Générer un nonce aléatoire entre 0 et 20
    const nonce = Math.floor(Math.random() * 21);
    setTargetNonce(nonce);

    // Générer l'indice basé sur le nonce réel
    const generatedHint = generateHint(nonce);
    setHint(generatedHint);

    // Données du bloc à miner
    const block = {
      index: Math.floor(Math.random() * 1000) + 1,
      timestamp: Date.now(),
      transactions: [
        {
          from: "Alice",
          to: "Bob",
          amount: 50,
          fee: 0.5
        },
        {
          from: playerName || "Joueur",
          to: "Charlie",
          amount: 25,
          fee: 0.25
        }
      ],
      previousHash: generateRandomHash(),
      difficulty: 2
    };

    setBlockData(block);
  }

  function generateRandomHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  function handleAnswerSelect(index) {
    setSelectedAnswer(index);
  }

  function handleSubmitAnswer() {
    if (selectedAnswer === null) {
      setMessage('⚠️ Veuillez sélectionner une réponse');
      return;
    }

    if (selectedAnswer === question.correctIndex) {
      setMessage('✅ Bonne réponse ! Vous avez débloqué un indice.');
      setHintUnlocked(true);
      setShowHint(true);
    } else {
      setMessage('❌ Mauvaise réponse. Vous pouvez continuer sans indice.');
      setHintUnlocked(true);
      setShowHint(false); // Ne pas afficher l'indice si mauvaise réponse
    }
  }

  function calculateHash(nonce) {
    // Algorithme de hash simplifié (arbitraire pour le jeu)
    const data = `${blockData.index}${blockData.timestamp}${blockData.previousHash}${nonce}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  function getBlockHash(nonce) {
    return '0x' + calculateHash(nonce);
  }

  function handleMineAttempt() {
    const nonce = parseInt(nonceInput, 10);

    if (isNaN(nonce) || nonce < 0 || nonce > 20) {
      setMessage('⚠️ Le nonce doit être un nombre entre 0 et 20');
      return;
    }

    const hash = calculateHash(nonce);
    const isCorrect = nonce === targetNonce;

    const newAttempt = {
      nonce,
      hash,
      isCorrect,
      attemptNumber: 11 - attempts
    };

    setAttemptHistory([newAttempt, ...attemptHistory]);

    if (isCorrect) {
      setMessage(`🎉 Félicitations ! Vous avez trouvé le bon nonce : ${nonce}`);
      setIsSuccess(true);
      return;
    }

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    if (newAttempts === 0) {
      setMessage(`❌ Vous avez épuisé vos 10 tentatives. Le bon nonce était : ${targetNonce}`);
    } else {
      // Donner un indice de proximité
      const diff = Math.abs(nonce - targetNonce);
      if (diff === 1) {
        setMessage(`🔥 Très chaud ! Il vous reste ${newAttempts} tentatives.`);
      } else if (diff <= 3) {
        setMessage(`🌡️ Chaud ! Il vous reste ${newAttempts} tentatives.`);
      } else if (diff <= 5) {
        setMessage(`❄️ Tiède. Il vous reste ${newAttempts} tentatives.`);
      } else {
        setMessage(`🧊 Froid. Il vous reste ${newAttempts} tentatives.`);
      }
    }

    setNonceInput('');
  }

  if (!blockData || !question) {
    return (
      <section className="card">
        <div className="spinner"></div>
        <p className="muted small">Préparation du challenge de minage...</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>⛏️ Mining Challenge</h2>
      <p className="muted small">
        Trouvez le bon nonce pour miner ce bloc et ajouter vos transactions à la blockchain.
      </p>

      {/* Bloc de blockchain visuel */}
      <div style={{ marginTop: '16px', border: '2px solid var(--accent)', borderRadius: '12px', overflow: 'hidden' }}>
        {/* En-tête du bloc */}
        <div style={{ background: 'var(--accent)', padding: '12px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>⛓️ BLOC #{blockData.index}</h3>
        </div>

        {/* Contenu du bloc */}
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '16px' }}>
          {/* Données du bloc */}
          <div style={{ fontSize: '0.8rem', lineHeight: '1.8', fontFamily: 'monospace' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px' }}>
              <div style={{ color: '#94a3b8' }}>Block Height:</div>
              <div style={{ color: '#38bdf8', fontWeight: '600' }}>{blockData.index}</div>

              <div style={{ color: '#94a3b8' }}>Timestamp:</div>
              <div style={{ color: '#38bdf8' }}>{blockData.timestamp}</div>

              <div style={{ color: '#94a3b8' }}>Date/Time:</div>
              <div style={{ color: '#38bdf8' }}>{new Date(blockData.timestamp).toLocaleString()}</div>

              <div style={{ color: '#94a3b8' }}>Previous Hash:</div>
              <div style={{ color: '#f472b6', wordBreak: 'break-all', fontSize: '0.7rem' }}>{blockData.previousHash}</div>

              <div style={{ color: '#94a3b8' }}>Difficulty:</div>
              <div style={{ color: '#38bdf8' }}>{blockData.difficulty}</div>

              <div style={{ color: '#94a3b8' }}>Nonce:</div>
              <div style={{ color: '#fbbf24', fontWeight: '700' }}>
                {isSuccess ? targetNonce : '???'}
                {!isSuccess && <span style={{ marginLeft: '8px', color: '#94a3b8', fontSize: '0.75rem' }}>(à trouver)</span>}
              </div>
            </div>

            {/* Transactions */}
            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '12px' }}>
              <div style={{ color: '#94a3b8', marginBottom: '8px' }}>Transactions ({blockData.transactions.length}):</div>
              {blockData.transactions.map((tx, idx) => (
                <div key={idx} style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '8px',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TX #{idx + 1}</div>
                  <div style={{ color: '#38bdf8', fontSize: '0.75rem' }}>
                    <span style={{ color: '#4ade80' }}>{tx.from}</span>
                    {' → '}
                    <span style={{ color: '#f472b6' }}>{tx.to}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
                    Amount: {tx.amount} tokens | Fee: {tx.fee} tokens
                  </div>
                </div>
              ))}
            </div>

            {/* Hash du bloc (affiché après succès) */}
            {isSuccess && (
              <div style={{ marginTop: '16px', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '12px' }}>
                <div style={{ color: '#94a3b8', marginBottom: '8px' }}>Block Hash:</div>
                <div style={{
                  background: 'rgba(74, 222, 128, 0.2)',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(74, 222, 128, 0.5)',
                  wordBreak: 'break-all',
                  fontSize: '0.7rem',
                  color: '#4ade80',
                  fontWeight: '600'
                }}>
                  {getBlockHash(targetNonce)}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#4ade80', marginTop: '4px', textAlign: 'center' }}>
                  ✓ Bloc validé avec nonce = {targetNonce}
                </div>
              </div>
            )}

            {/* Hash en cours (pendant les tentatives) */}
            {!isSuccess && attemptHistory.length > 0 && (
              <div style={{ marginTop: '16px', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '12px' }}>
                <div style={{ color: '#94a3b8', marginBottom: '8px' }}>Dernier hash tenté:</div>
                <div style={{
                  background: 'rgba(248, 113, 113, 0.2)',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(248, 113, 113, 0.5)',
                  wordBreak: 'break-all',
                  fontSize: '0.7rem',
                  color: '#f87171',
                  fontWeight: '600'
                }}>
                  0x{attemptHistory[0].hash}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#f87171', marginTop: '4px', textAlign: 'center' }}>
                  ✗ Hash invalide avec nonce = {attemptHistory[0].nonce}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question de culture générale */}
      {!hintUnlocked && (
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9rem', marginTop: 0 }}>📚 Question bonus (débloquez un indice)</h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>{question.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {question.options.map((option, idx) => (
              <label
                key={idx}
                style={{
                  padding: '8px 12px',
                  background: selectedAnswer === idx ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${selectedAnswer === idx ? 'var(--accent)' : 'rgba(148, 163, 184, 0.3)'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={selectedAnswer === idx}
                  onChange={() => handleAnswerSelect(idx)}
                />
                {option}
              </label>
            ))}
          </div>
          <button
            onClick={handleSubmitAnswer}
            style={{ marginTop: '12px' }}
            disabled={selectedAnswer === null}
          >
            Valider ma réponse
          </button>
        </div>
      )}

      {/* Indice */}
      {showHint && (
        <div className="notice success-notice" style={{ marginTop: '12px' }}>
          💡 <strong>Indice :</strong> {hint}
        </div>
      )}

      {/* Zone de minage */}
      {hintUnlocked && !isSuccess && attempts > 0 && (
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9rem', marginTop: 0 }}>⛏️ Trouvez le nonce</h3>
          <p className="small muted">Entrez un nombre entre 0 et 20. Tentatives restantes: <strong>{attempts}/10</strong></p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="number"
              min="0"
              max="20"
              value={nonceInput}
              onChange={(e) => setNonceInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMineAttempt()}
              placeholder="Entrez le nonce"
              style={{ flex: 1 }}
            />
            <button onClick={handleMineAttempt}>Miner</button>
          </div>
        </div>
      )}

      {/* Message de résultat */}
      {message && (
        <div className={`notice ${message.includes('✅') || message.includes('🎉') ? 'success-notice' : message.includes('❌') || message.includes('⚠️') ? 'error-notice' : ''}`} style={{ marginTop: '12px' }}>
          {message}
        </div>
      )}

      {/* Historique des tentatives */}
      {attemptHistory.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '0.9rem' }}>📋 Historique des tentatives</h3>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            <table className="table" style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nonce</th>
                  <th>Hash généré</th>
                  <th>Résultat</th>
                </tr>
              </thead>
              <tbody>
                {attemptHistory.map((attempt, idx) => (
                  <tr key={idx} style={{ background: attempt.isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'transparent' }}>
                    <td>{attempt.attemptNumber}</td>
                    <td>{attempt.nonce}</td>
                    <td><code>0x{attempt.hash}</code></td>
                    <td>{attempt.isCorrect ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        {onBack && (
          <button className="btn-outline" onClick={onBack}>
            Retour
          </button>
        )}
        {isSuccess && onComplete && (
          <button onClick={() => onComplete({ nonce: targetNonce, attempts: 10 - attempts })}>
            Terminer le challenge
          </button>
        )}
        {!isSuccess && attempts === 0 && (
          <button onClick={initializeChallenge}>
            Recommencer
          </button>
        )}
      </div>
    </section>
  );
}
