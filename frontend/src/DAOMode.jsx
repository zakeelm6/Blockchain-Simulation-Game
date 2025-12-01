import React, { useState } from 'react';
import { DAOCreate } from './DAOCreate';
import { DAOWaiting } from './DAOWaiting';
import { DAOJoin } from './DAOJoin';
import { DAODashboard } from './DAODashboard';

export function DAOMode({ onBack }) {
  const [step, setStep] = useState('choice'); // 'choice' | 'create' | 'join' | 'waiting' | 'active'
  const [role, setRole] = useState(null); // 'creator' | 'member'
  const [daoCode, setDaoCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [dao, setDAO] = useState(null);

  function handleChoice(chosenRole) {
    setRole(chosenRole);
    if (chosenRole === 'creator') {
      setStep('create');
    } else {
      setStep('join');
    }
  }

  function handleDAOCreated(code, daoData) {
    setDaoCode(code);
    setDAO(daoData);
    setMemberName(daoData.createdBy);
    setStep('waiting');
  }

  function handleJoined(code, name, daoData) {
    setDaoCode(code);
    setMemberName(name);
    setDAO(daoData);

    if (daoData.status === 'active') {
      setStep('active');
    } else {
      setStep('waiting');
    }
  }

  function handleActivate(daoData) {
    setDAO(daoData);
    setStep('active');
  }

  function handleBackToChoice() {
    setStep('choice');
    setRole(null);
    setDaoCode('');
    setMemberName('');
    setDAO(null);
  }

  // Écran de choix: Créer ou Rejoindre
  if (step === 'choice') {
    return (
      <section className="card">
        <h2>🏛️ Mode DAO Builder</h2>
        <p className="muted">Apprenez la gouvernance décentralisée en pratique</p>

        <div style={{ marginTop: '32px', display: 'grid', gap: '16px' }}>
          <div
            onClick={() => handleChoice('creator')}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
              border: '2px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '3rem' }}>🎨</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>Créer un DAO</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  En tant que responsable, configurez les paramètres de gouvernance
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleChoice('member')}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.2))',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(56, 189, 248, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '3rem' }}>👥</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>Rejoindre un DAO</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  Participez avec un code et votez sur les propositions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="notice" style={{ marginTop: '24px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>📚 Ce que vous allez apprendre :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Tokens de gouvernance et distribution</li>
            <li>Quorum et seuils d'approbation</li>
            <li>Création et vote sur les propositions</li>
            <li>Treasury et financement décentralisé</li>
            <li>Vote pondéré selon les tokens détenus</li>
          </ul>
        </div>

        <button onClick={onBack} style={{ marginTop: '24px', width: '100%' }}>
          Retour au Menu
        </button>
      </section>
    );
  }

  // Écran de création
  if (step === 'create') {
    return <DAOCreate onDAOCreated={handleDAOCreated} onBack={handleBackToChoice} />;
  }

  // Écran de connexion
  if (step === 'join') {
    return <DAOJoin onJoined={handleJoined} onBack={handleBackToChoice} />;
  }

  // Salle d'attente (avant activation)
  if (step === 'waiting') {
    return <DAOWaiting daoCode={daoCode} dao={dao} onActivate={handleActivate} />;
  }

  // DAO actif - Dashboard
  if (step === 'active') {
    return <DAODashboard daoCode={daoCode} memberName={memberName} dao={dao} />;
  }

  return null;
}
