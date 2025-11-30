import React, { useState, useEffect } from 'react';

export function TeamVoting({ classCode, participantName, classroom: initialClassroom, onVotingComplete }) {
  const [classroom, setClassroom] = useState(initialClassroom);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  // Trouver le groupe du participant
  const myGroup = classroom.groups?.find(g =>
    g.members.includes(participantName) || g.validator === participantName
  );

  const isValidator = myGroup?.validator === participantName;
  const isVoter = myGroup?.members.includes(participantName);

  // Polling pour mettre à jour l'état
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/class/${classCode}`);
        const data = await response.json();

        if (data.ok) {
          setClassroom(data.classroom);

          // Si la phase de validation a commencé
          if (data.classroom.status === 'validating') {
            onVotingComplete(data.classroom);
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [classCode, onVotingComplete]);

  async function handleVote() {
    if (!selectedContract) {
      setError('Veuillez sélectionner un smart contract');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: participantName,
          contractId: selectedContract
        })
      });

      const data = await response.json();

      if (data.ok) {
        setHasVoted(true);
        setClassroom(data.classroom);
      } else {
        setError(data.error || 'Erreur lors du vote');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Récupérer les 2 smart contracts à choisir
  const contracts = classroom.selectedContracts || [];
  const contract1Id = contracts[0];
  const contract2Id = contracts[1];

  if (!myGroup) {
    return (
      <section className="card">
        <p className="muted">Erreur: Groupe non trouvé</p>
      </section>
    );
  }

  if (isValidator) {
    return (
      <section className="card">
        <h2>🛡️ Vous êtes Validateur</h2>
        <p className="muted">Votre rôle sera de valider les choix des autres équipes</p>

        <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(168, 85, 247, 0.1)', border: '2px solid rgba(168, 85, 247, 0.4)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛡️</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>Validateur - {myGroup.name}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            En attente que votre équipe vote pour un smart contract...
          </p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Votre équipe</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {myGroup.members.map((member, idx) => {
              const voted = myGroup.votes[member] !== undefined;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    background: voted ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0,0,0,0.3)',
                    border: `1px solid ${voted ? 'rgba(74, 222, 128, 0.4)' : 'rgba(148, 163, 184, 0.2)'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{member}</span>
                  <span>{voted ? '✅ A voté' : '⏳ En attente'}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="notice" style={{ marginTop: '20px' }}>
          <strong>ℹ️ Votre mission :</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
            Une fois que votre équipe aura choisi un smart contract, vous validerez les choix
            des <strong>autres équipes</strong>. Points : +5 si correct, -3 si incorrect.
          </p>
        </div>
      </section>
    );
  }

  if (!isVoter) {
    return (
      <section className="card">
        <p className="muted">Vous n'êtes pas dans un groupe votant</p>
      </section>
    );
  }

  if (hasVoted || myGroup.votes[participantName]) {
    return (
      <section className="card">
        <h2>✅ Vote enregistré</h2>
        <p className="muted">Votre vote a été pris en compte</p>

        <div className="success-animation" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="success-checkmark">✓</div>
          <h3 style={{ marginTop: '20px' }}>Merci d'avoir voté !</h3>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>État des votes - {myGroup.name}</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {myGroup.members.map((member, idx) => {
              const voted = myGroup.votes[member] !== undefined;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    background: voted ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0,0,0,0.3)',
                    border: `1px solid ${voted ? 'rgba(74, 222, 128, 0.4)' : 'rgba(148, 163, 184, 0.2)'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: member === participantName ? '600' : '400' }}>
                    {member}
                    {member === participantName && <span style={{ marginLeft: '8px', color: 'var(--accent)', fontSize: '0.75rem' }}>(Vous)</span>}
                  </span>
                  <span>{voted ? '✅ A voté' : '⏳ En attente'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {myGroup.contractChoice && (
          <div className="notice success-notice" style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>
              🎉 Votre équipe a choisi un smart contract ! En attente des autres équipes...
            </p>
          </div>
        )}

        {!myGroup.contractChoice && (
          <div className="notice" style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>
              ⏰ En attente que tous les membres votent...
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="card">
      <h2>🗳️ Vote d'Équipe</h2>
      <p className="muted">Choisissez le smart contract que votre équipe souhaite valider</p>

      {/* Info du groupe */}
      <div style={{ marginTop: '20px', padding: '16px', background: `linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.1))`, border: '2px solid var(--accent)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '2rem' }}>{myGroup.logo}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{myGroup.name}</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              {myGroup.members.length} votants + 1 validateur
            </p>
          </div>
        </div>
      </div>

      {/* Choix des smart contracts */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Choisissez un smart contract :</h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {[contract1Id, contract2Id].map((contractId, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedContract(contractId)}
              style={{
                padding: '16px',
                background: selectedContract === contractId ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.3)',
                border: `2px solid ${selectedContract === contractId ? 'var(--accent)' : 'rgba(148, 163, 184, 0.2)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Contract {idx + 1}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    ID: {contractId}
                  </div>
                </div>
                {selectedContract === contractId && (
                  <div style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>✓</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="notice error-notice" style={{ marginTop: '16px' }}>
          {error}
        </div>
      )}

      <div className="notice" style={{ marginTop: '20px' }}>
        <strong>ℹ️ Comment ça marche :</strong>
        <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
          <li>Vous votez avec vos 2 coéquipiers (3 votes au total)</li>
          <li>Le contrat majoritaire sera choisi pour votre équipe</li>
          <li>Bon choix = +10 points pour l'équipe</li>
        </ul>
      </div>

      <button
        onClick={handleVote}
        disabled={loading || !selectedContract}
        style={{ marginTop: '24px', width: '100%' }}
      >
        {loading ? 'Envoi du vote...' : 'Confirmer mon vote'}
      </button>
    </section>
  );
}
