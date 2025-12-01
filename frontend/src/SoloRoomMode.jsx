import React, { useState } from 'react';
import { SoloRoomCreate } from './SoloRoomCreate';
import { SoloRoomJoin } from './SoloRoomJoin';
import { SoloRoomDashboard } from './SoloRoomDashboard';
import { SoloRoomPlayer } from './SoloRoomPlayer';

export function SoloRoomMode({ onBack }) {
  const [step, setStep] = useState('choice'); // 'choice' | 'create' | 'join' | 'dashboard' | 'playing'
  const [role, setRole] = useState(null); // 'host' | 'player'
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [room, setRoom] = useState(null);

  function handleChoice(chosenRole) {
    setRole(chosenRole);
    if (chosenRole === 'host') {
      setStep('create');
    } else {
      setStep('join');
    }
  }

  function handleRoomCreated(code, roomData, hostName) {
    setRoomCode(code);
    setRoom(roomData);
    setPlayerName(hostName);
    setStep('dashboard');
  }

  function handleJoined(code, name, roomData) {
    setRoomCode(code);
    setPlayerName(name);
    setRoom(roomData);
    setStep('playing');
  }

  function handleBackToChoice() {
    setStep('choice');
    setRole(null);
    setRoomCode('');
    setPlayerName('');
    setRoom(null);
  }

  // Écran de choix
  if (step === 'choice') {
    return (
      <section className="card">
        <h2>🎮 Mode Solo en Salle</h2>
        <p className="muted">Jouez individuellement dans une salle partagée</p>

        <div style={{ marginTop: '32px', display: 'grid', gap: '16px' }}>
          <div
            onClick={() => handleChoice('host')}
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
              <div style={{ fontSize: '3rem' }}>👨‍💼</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>Créer une Salle</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  En tant qu'hôte, créez une salle et obtenez une clé d'accès
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleChoice('player')}
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
              <div style={{ fontSize: '3rem' }}>🎮</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>Rejoindre une Salle</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  Entrez la clé de la salle et jouez en solo
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="notice" style={{ marginTop: '24px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>📚 Concept :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Chaque joueur progresse individuellement</li>
            <li>L'hôte peut suivre la progression de tous</li>
            <li>Validation par 8 bots automatiques</li>
            <li>Classement en temps réel des participants</li>
          </ul>
        </div>

        <button onClick={onBack} style={{ marginTop: '24px', width: '100%' }}>
          Retour au Menu
        </button>
      </section>
    );
  }

  if (step === 'create') {
    return <SoloRoomCreate onRoomCreated={handleRoomCreated} onBack={handleBackToChoice} />;
  }

  if (step === 'join') {
    return <SoloRoomJoin onJoined={handleJoined} onBack={handleBackToChoice} />;
  }

  if (step === 'dashboard') {
    return (
      <SoloRoomDashboard
        roomCode={roomCode}
        room={room}
        hostName={playerName}
        onBack={handleBackToChoice}
      />
    );
  }

  if (step === 'playing') {
    return (
      <SoloRoomPlayer
        roomCode={roomCode}
        playerName={playerName}
        onBack={handleBackToChoice}
      />
    );
  }

  return null;
}
