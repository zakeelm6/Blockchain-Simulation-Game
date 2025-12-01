import React, { useState, useEffect } from 'react';

export function DAODashboard({ daoCode, memberName, dao: initialDAO }) {
  const [dao, setDAO] = useState(initialDAO);
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Polling pour mises à jour
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/dao/${daoCode}`);
        const data = await response.json();

        if (data.ok) {
          setDAO(data.dao);
        }
      } catch (err) {
        console.error('Erreur:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [daoCode]);

  const member = dao.members.find(m => m.name === memberName);
  const myTokens = member?.tokens || 0;
  const totalTokens = dao.members.reduce((sum, m) => sum + m.tokens, 0);

  const activeProposals = dao.proposals.filter(p => p.status === 'active');
  const passedProposals = dao.proposals.filter(p => p.status === 'passed' || p.status === 'executed');
  const rejectedProposals = dao.proposals.filter(p => p.status === 'rejected');

  const hasActiveProposal = dao.proposals.some(p => p.proposer === memberName && p.status === 'active');

  function formatTimeRemaining(votingEndsAt) {
    const now = Date.now();
    const diff = votingEndsAt - now;

    if (diff <= 0) return 'Terminé';

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  }

  if (showCreateProposal) {
    return <CreateProposalForm daoCode={daoCode} dao={dao} memberName={memberName} onBack={() => setShowCreateProposal(false)} onCreated={(updatedDAO) => { setDAO(updatedDAO); setShowCreateProposal(false); }} />;
  }

  if (selectedProposal) {
    return <ProposalVoteView daoCode={daoCode} dao={dao} memberName={memberName} proposal={selectedProposal} myTokens={myTokens} onBack={() => setSelectedProposal(null)} onVoted={(updatedDAO) => setDAO(updatedDAO)} />;
  }

  return (
    <section className="card">
      <h2>🏛️ {dao.name}</h2>
      <p className="muted">{dao.description || 'Organisation Autonome Décentralisée'}</p>

      {/* Statistiques du membre */}
      <div style={{
        marginTop: '24px',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
        border: '2px solid rgba(251, 191, 36, 0.5)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>VOTRE MEMBRE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{memberName}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>VOS TOKENS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>{myTokens} {dao.tokenSymbol}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>POUVOIR DE VOTE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent)' }}>{((myTokens / totalTokens) * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>TREASURY</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#4ade80' }}>{dao.treasuryBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Bouton créer proposition */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          onClick={() => setShowCreateProposal(true)}
          disabled={hasActiveProposal}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            opacity: hasActiveProposal ? 0.5 : 1,
            cursor: hasActiveProposal ? 'not-allowed' : 'pointer'
          }}
        >
          ➕ Créer une Proposition
        </button>
        {hasActiveProposal && (
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
            Vous avez déjà une proposition active
          </p>
        )}
      </div>

      {/* Propositions actives */}
      {activeProposals.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--accent)' }}>⏳ Propositions Actives ({activeProposals.length})</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {activeProposals.map((proposal) => {
              const hasVoted = proposal.votes[memberName] !== undefined;
              const timeRemaining = formatTimeRemaining(proposal.votingEndsAt);
              const participationRate = (Object.keys(proposal.votes).length / dao.members.length) * 100;

              return (
                <div
                  key={proposal.id}
                  style={{
                    padding: '16px',
                    background: hasVoted ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.3)',
                    border: `2px solid ${hasVoted ? 'var(--accent)' : 'rgba(148, 163, 184, 0.2)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedProposal(proposal)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{proposal.title}</h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                        Par {proposal.proposer} • {proposal.type === 'funding' ? '💰 Financement' : proposal.type === 'parameter' ? '⚙️ Paramètres' : '📋 Général'}
                      </p>
                    </div>
                    {proposal.type === 'funding' && (
                      <div style={{
                        padding: '4px 12px',
                        background: 'rgba(74, 222, 128, 0.2)',
                        border: '1px solid rgba(74, 222, 128, 0.4)',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#4ade80'
                      }}>
                        {proposal.amount.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.75rem', marginBottom: '8px' }}>
                    <div>
                      <span style={{ color: '#94a3b8' }}>POUR: </span>
                      <span style={{ color: '#4ade80', fontWeight: '600' }}>{proposal.results.for}</span>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8' }}>CONTRE: </span>
                      <span style={{ color: '#f87171', fontWeight: '600' }}>{proposal.results.against}</span>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8' }}>ABSTENTION: </span>
                      <span style={{ color: '#94a3b8', fontWeight: '600' }}>{proposal.results.abstain}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Participation: {participationRate.toFixed(0)}% • Quorum: {dao.quorum}%
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      background: hasVoted ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                      border: `1px solid ${hasVoted ? 'rgba(74, 222, 128, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`,
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      color: hasVoted ? '#4ade80' : '#fbbf24'
                    }}>
                      {hasVoted ? '✓ Voté' : `⏱️ ${timeRemaining}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Propositions approuvées */}
      {passedProposals.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#4ade80' }}>✅ Approuvées ({passedProposals.length})</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {passedProposals.slice(0, 3).map((proposal) => (
              <div
                key={proposal.id}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ fontWeight: '600' }}>{proposal.title}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>
                  {proposal.status === 'executed' ? '✓ Exécutée' : 'En attente d\'exécution'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Propositions rejetées */}
      {rejectedProposals.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#f87171' }}>❌ Rejetées ({rejectedProposals.length})</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {rejectedProposals.slice(0, 3).map((proposal) => (
              <div
                key={proposal.id}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ fontWeight: '600' }}>{proposal.title}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>
                  {!proposal.results.quorumReached ? 'Quorum non atteint' : 'Rejetée par vote'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeProposals.length === 0 && passedProposals.length === 0 && rejectedProposals.length === 0 && (
        <div className="notice" style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>📭 Aucune proposition pour le moment</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Créez la première proposition pour lancer la gouvernance du DAO !
          </p>
        </div>
      )}
    </section>
  );
}

// Composant pour créer une proposition
function CreateProposalForm({ daoCode, dao, memberName, onBack, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('general');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    if (type === 'funding' && (!amount || amount <= 0)) {
      setError('Montant invalide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/dao/${daoCode}/proposal/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposerName: memberName,
          title: title.trim(),
          description: description.trim(),
          type,
          amount: type === 'funding' ? parseInt(amount) : 0
        })
      });

      const data = await response.json();

      if (data.ok) {
        onCreated(data.dao);
      } else {
        setError(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>➕ Créer une Proposition</h2>
      <p className="muted">Soumettez une proposition au vote du DAO</p>

      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Titre *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Financer le projet XYZ"
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre proposition en détail..."
            style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
            Type de proposition
          </label>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              { value: 'general', icon: '📋', label: 'Général', desc: 'Proposition générale' },
              { value: 'funding', icon: '💰', label: 'Financement', desc: 'Demande de fonds du treasury' },
              { value: 'parameter', icon: '⚙️', label: 'Paramètres', desc: 'Modification des paramètres' }
            ].map((t) => (
              <div
                key={t.value}
                onClick={() => setType(t.value)}
                style={{
                  padding: '12px',
                  background: type === t.value ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.3)',
                  border: `2px solid ${type === t.value ? 'var(--accent)' : 'rgba(148, 163, 184, 0.2)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {type === 'funding' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Montant demandé *
            </label>
            <input
              type="number"
              min="1"
              max={dao.treasuryBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
              style={{ width: '100%' }}
              disabled={loading}
            />
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              Treasury disponible: {dao.treasuryBalance.toLocaleString()}
            </p>
          </div>
        )}

        {error && (
          <div className="notice error-notice" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="notice" style={{ marginBottom: '16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>ℹ️ Après création :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Durée du vote: {dao.votingDuration} minutes</li>
            <li>Quorum requis: {dao.quorum}%</li>
            <li>Approbation requise: {dao.approvalThreshold}%</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onBack} disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !title} style={{ flex: 1 }}>
            {loading ? 'Création...' : 'Soumettre la Proposition'}
          </button>
        </div>
      </div>
    </section>
  );
}

// Composant pour voter sur une proposition
function ProposalVoteView({ daoCode, dao, memberName, proposal, myTokens, onBack, onVoted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasVoted = proposal.votes[memberName] !== undefined;
  const myVote = proposal.votes[memberName];

  const totalVotes = proposal.results.for + proposal.results.against + proposal.results.abstain;
  const totalTokens = dao.members.reduce((sum, m) => sum + m.tokens, 0);
  const participationRate = (totalVotes / totalTokens) * 100;

  async function handleVote(voteType) {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/dao/${daoCode}/proposal/${proposal.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName,
          vote: voteType
        })
      });

      const data = await response.json();

      if (data.ok) {
        onVoted(data.dao);
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

  return (
    <section className="card">
      <button onClick={onBack} style={{ marginBottom: '16px' }}>← Retour</button>

      <h2>{proposal.title}</h2>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '4px 12px',
          background: 'rgba(139, 92, 246, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#8b5cf6'
        }}>
          {proposal.type === 'funding' ? '💰 Financement' : proposal.type === 'parameter' ? '⚙️ Paramètres' : '📋 Général'}
        </span>
        <span style={{
          padding: '4px 12px',
          background: 'rgba(56, 189, 248, 0.2)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#38bdf8'
        }}>
          Par {proposal.proposer}
        </span>
      </div>

      {proposal.description && (
        <p style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.9rem' }}>
          {proposal.description}
        </p>
      )}

      {proposal.type === 'funding' && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>MONTANT DEMANDÉ</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4ade80' }}>
            {proposal.amount.toLocaleString()}
          </div>
        </div>
      )}

      {/* Résultats actuels */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>📊 Résultats Actuels</h3>

        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ padding: '12px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>POUR</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4ade80' }}>{proposal.results.for} tokens</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${totalVotes > 0 ? (proposal.results.for / totalVotes) * 100 : 0}%`, height: '100%', background: '#4ade80' }} />
            </div>
          </div>

          <div style={{ padding: '12px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>CONTRE</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f87171' }}>{proposal.results.against} tokens</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${totalVotes > 0 ? (proposal.results.against / totalVotes) * 100 : 0}%`, height: '100%', background: '#f87171' }} />
            </div>
          </div>

          <div style={{ padding: '12px', background: 'rgba(148, 163, 184, 0.1)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>ABSTENTION</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>{proposal.results.abstain} tokens</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${totalVotes > 0 ? (proposal.results.abstain / totalVotes) * 100 : 0}%`, height: '100%', background: '#94a3b8' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Participation:</span>
            <span style={{ fontWeight: '600', color: participationRate >= dao.quorum ? '#4ade80' : '#fbbf24' }}>
              {participationRate.toFixed(1)}% / {dao.quorum}%
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Quorum:</span>
            <span style={{ fontWeight: '600', color: proposal.results.quorumReached ? '#4ade80' : '#f87171' }}>
              {proposal.results.quorumReached ? '✓ Atteint' : '✗ Non atteint'}
            </span>
          </div>
        </div>
      </div>

      {/* Voter */}
      {!hasVoted ? (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>🗳️ Votre Vote</h3>

          <div className="notice" style={{ marginBottom: '16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <strong>Votre poids de vote: {myTokens} tokens</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
              Vote POUR: +{myTokens} • Vote CONTRE: +{myTokens} • Abstention: +{myTokens}
            </p>
          </div>

          {error && (
            <div className="notice error-notice" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: '12px' }}>
            <button
              onClick={() => handleVote('for')}
              disabled={loading}
              style={{
                padding: '16px',
                background: 'rgba(74, 222, 128, 0.2)',
                border: '2px solid rgba(74, 222, 128, 0.5)',
                color: '#4ade80',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}
            >
              ✓ POUR
            </button>
            <button
              onClick={() => handleVote('against')}
              disabled={loading}
              style={{
                padding: '16px',
                background: 'rgba(248, 113, 113, 0.2)',
                border: '2px solid rgba(248, 113, 113, 0.5)',
                color: '#f87171',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}
            >
              ✗ CONTRE
            </button>
            <button
              onClick={() => handleVote('abstain')}
              disabled={loading}
              style={{
                padding: '16px',
                background: 'rgba(148, 163, 184, 0.2)',
                border: '2px solid rgba(148, 163, 184, 0.5)',
                color: '#94a3b8',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}
            >
              ⊘ ABSTENTION
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(56, 189, 248, 0.1)', border: '2px solid var(--accent)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
            {myVote.vote === 'for' ? '✓' : myVote.vote === 'against' ? '✗' : '⊘'}
          </div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--accent)' }}>Vote Enregistré !</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            Vous avez voté <strong>{myVote.vote === 'for' ? 'POUR' : myVote.vote === 'against' ? 'CONTRE' : 'ABSTENTION'}</strong> avec {myVote.weight} tokens
          </p>
        </div>
      )}
    </section>
  );
}
