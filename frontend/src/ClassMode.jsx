import React, { useState } from 'react';
import { ClassCreate } from './ClassCreate';
import { ClassWaiting } from './ClassWaiting';
import { ClassJoin } from './ClassJoin';
import { ParticipantWaiting } from './ParticipantWaiting';
import { TeamVoting } from './TeamVoting';
import { ValidatorView } from './ValidatorView';
import { TeamMining } from './TeamMining';
import { IndividualVoting } from './IndividualVoting';
import { ClassResults } from './ClassResults';
import { SoloClassMode } from './SoloClassMode';

export function ClassMode({ onBack }) {
  const [step, setStep] = useState('choice'); // 'choice' | 'create' | 'join' | 'waiting-teacher' | 'waiting-student' | 'voting' | 'validating' | 'mining' | 'dao' | 'results'
  const [role, setRole] = useState(null); // 'teacher' | 'student'
  const [classCode, setClassCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [classroom, setClassroom] = useState(null);

  function handleRoleChoice(selectedRole) {
    setRole(selectedRole);
    if (selectedRole === 'teacher') {
      setStep('create');
    } else {
      setStep('join');
    }
  }

  function handleClassCreated(code, classroomData) {
    setClassCode(code);
    setClassroom(classroomData);

    // Si c'est un mode solo, aller au tableau de bord
    if (classroomData.mode === 'solo') {
      setStep('solo-dashboard');
    } else {
      setStep('waiting-teacher');
    }
  }

  function handleJoined(code, name, classroomData) {
    setClassCode(code);
    setParticipantName(name);
    setClassroom(classroomData);

    // Si c'est un mode solo, aller directement au jeu
    if (classroomData.mode === 'solo') {
      setStep('solo-playing');
    } else {
      setStep('waiting-student');
    }
  }

  function handleGameStarted(classroomData) {
    setClassroom(classroomData);
    setStep('voting');
  }

  function handleVotingComplete(classroomData) {
    setClassroom(classroomData);
    setStep('validating');
  }

  function handleValidationComplete(classroomData) {
    setClassroom(classroomData);

    // Vérifier si on passe au mining ou aux résultats finaux
    if (classroomData.status === 'mining') {
      setStep('mining');
    } else {
      // Résultats finaux
      alert('Challenge terminé ! Voir les résultats.');
      handleBackToHome();
    }
  }

  function handleMiningComplete(classroomData) {
    setClassroom(classroomData);

    // Vérifier si on passe au vote DAO ou aux résultats
    if (classroomData.status === 'dao') {
      setStep('dao');
    } else {
      setStep('results');
    }
  }

  function handleDAOComplete(classroomData) {
    setClassroom(classroomData);
    setStep('results');
  }

  function handleBackToHome() {
    setStep('choice');
    setRole(null);
    setClassCode('');
    setParticipantName('');
    setClassroom(null);
  }

  if (step === 'choice') {
    return (
      <section className="card">
        <h2>🎓 Mode Classe</h2>
        <p className="muted">Jouez en équipe avec toute votre classe</p>

        <div style={{ marginTop: '32px', display: 'grid', gap: '16px' }}>
          {/* Responsable */}
          <div
            onClick={() => handleRoleChoice('teacher')}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.1))',
              border: '2px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '12px' }}>👨‍🏫</div>
            <h3 style={{ margin: '0 0 8px 0', textAlign: 'center', fontSize: '1.2rem' }}>Responsable</h3>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
              Créez une classe et obtenez un code à partager
            </p>
          </div>

          {/* Participant */}
          <div
            onClick={() => handleRoleChoice('student')}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(56, 189, 248, 0.1))',
              border: '2px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4ade80'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)'}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '12px' }}>🎓</div>
            <h3 style={{ margin: '0 0 8px 0', textAlign: 'center', fontSize: '1.2rem' }}>Participant</h3>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
              Rejoignez une classe avec un code
            </p>
          </div>
        </div>

        <div className="notice" style={{ marginTop: '24px' }}>
          <strong>ℹ️ Comment ça marche :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Groupes de 4 : 3 votants + 1 validateur</li>
            <li>Vote en équipe pour choisir un smart contract</li>
            <li>Les validateurs évaluent les choix des autres équipes</li>
            <li>Système de points individuel et par équipe</li>
          </ul>
        </div>

        <button onClick={onBack} style={{ marginTop: '24px', width: '100%' }}>
          Retour à l'accueil
        </button>
      </section>
    );
  }

  if (step === 'create') {
    return <ClassCreate onClassCreated={handleClassCreated} onBack={handleBackToHome} />;
  }

  if (step === 'join') {
    return <ClassJoin onJoined={handleJoined} onBack={handleBackToHome} />;
  }

  if (step === 'waiting-teacher') {
    return (
      <ClassWaiting
        classCode={classCode}
        classroom={classroom}
        onStart={handleGameStarted}
        onBack={handleBackToHome}
      />
    );
  }

  if (step === 'waiting-student') {
    return (
      <ParticipantWaiting
        classCode={classCode}
        participantName={participantName}
        classroom={classroom}
        onGameStarted={handleGameStarted}
      />
    );
  }

  if (step === 'voting') {
    return (
      <TeamVoting
        classCode={classCode}
        participantName={participantName}
        classroom={classroom}
        onVotingComplete={handleVotingComplete}
      />
    );
  }

  if (step === 'validating') {
    return (
      <ValidatorView
        classCode={classCode}
        participantName={participantName}
        classroom={classroom}
        onValidationComplete={handleValidationComplete}
      />
    );
  }

  if (step === 'mining') {
    return (
      <TeamMining
        classCode={classCode}
        participantName={participantName}
        classroom={classroom}
        onMiningComplete={handleMiningComplete}
      />
    );
  }

  if (step === 'dao') {
    return (
      <IndividualVoting
        classCode={classCode}
        participantName={participantName}
        classroom={classroom}
        onVotingComplete={handleDAOComplete}
      />
    );
  }

  if (step === 'results') {
    return (
      <ClassResults
        classroom={classroom}
        participantName={participantName}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Mode Solo en Classe - Dashboard responsable
  if (step === 'solo-dashboard') {
    return (
      <SoloClassMode
        classCode={classCode}
        classroom={classroom}
        role="teacher"
      />
    );
  }

  // Mode Solo en Classe - Interface joueur
  if (step === 'solo-playing') {
    return (
      <SoloClassMode
        classCode={classCode}
        participantName={participantName}
        classroom={classroom}
        role="student"
      />
    );
  }

  return null;
}
