import React, { useState } from 'react';
import { SoloDashboard } from './SoloDashboard';
import { SoloClassPlayer } from './SoloClassPlayer';
import { SoloClassDAO } from './SoloClassDAO';
import { ClassResults } from './ClassResults';

export function SoloClassMode({ classCode, participantName, classroom: initialClassroom, role }) {
  const [step, setStep] = useState(role === 'teacher' ? 'dashboard' : 'playing');
  const [classroom, setClassroom] = useState(initialClassroom);

  function handleStartDAO(classroomData) {
    setClassroom(classroomData);
    setStep('dao');
  }

  function handleComplete(classroomData) {
    setClassroom(classroomData);
    setStep('results');
  }

  // Vue du responsable (tableau de bord)
  if (role === 'teacher') {
    if (step === 'dashboard' || step === 'dao') {
      return <SoloDashboard classCode={classCode} classroom={classroom} onStartDAO={handleStartDAO} />;
    }

    if (step === 'results') {
      return (
        <section className="card">
          <h2>🏆 Résultats Finaux - {classroom.name}</h2>
          <p className="muted">Mode Solo en Classe terminé</p>

          {/* Podium */}
          {classroom.finalRankings && classroom.finalRankings.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>🏆 Podium</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {classroom.finalRankings.slice(0, 3).map((player, idx) => {
                  const medals = ['🥇', '🥈', '🥉'];

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        background: idx === 0
                          ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))'
                          : 'rgba(0,0,0,0.3)',
                        border: `2px solid ${idx === 0 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(148, 163, 184, 0.2)'}`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                      }}
                    >
                      <div style={{
                        fontSize: '3rem',
                        width: '60px',
                        textAlign: 'center'
                      }}>
                        {medals[idx]}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>
                          {player.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Score initial : {player.initialScore} • Votes : +{player.votesFor} / -{player.votesAgainst}
                        </div>
                      </div>

                      <div style={{
                        padding: '12px 20px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                          FINAL
                        </div>
                        <div style={{
                          fontSize: '1.8rem',
                          fontWeight: '700',
                          color: idx === 0 ? '#fbbf24' : 'var(--accent)'
                        }}>
                          {player.finalScore}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Classement complet */}
          {classroom.finalRankings && (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>📊 Classement Complet</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>#</th>
                      <th>Participant</th>
                      <th>Score Initial</th>
                      <th>Votes POUR</th>
                      <th>Votes CONTRE</th>
                      <th>Score Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classroom.finalRankings.map((player, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: idx < 3 ? 'var(--accent)' : 'rgba(148, 163, 184, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: idx < 3 ? '#0f172a' : '#fff',
                            fontWeight: '700'
                          }}>
                            {idx + 1}
                          </div>
                        </td>
                        <td style={{ fontWeight: '600' }}>{player.name}</td>
                        <td>{player.initialScore}</td>
                        <td style={{ color: '#4ade80', fontWeight: '600' }}>+{player.votesFor}</td>
                        <td style={{ color: '#f87171', fontWeight: '600' }}>-{player.votesAgainst}</td>
                        <td style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '1.1rem' }}>
                          {player.finalScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      );
    }
  }

  // Vue du participant
  if (role === 'student') {
    if (step === 'playing') {
      return (
        <SoloClassPlayer
          classCode={classCode}
          participantName={participantName}
          onComplete={handleComplete}
        />
      );
    }

    if (step === 'dao') {
      return (
        <SoloClassDAO
          classCode={classCode}
          participantName={participantName}
          classroom={classroom}
          onComplete={handleComplete}
        />
      );
    }

    if (step === 'results') {
      return (
        <ClassResults
          classroom={classroom}
          participantName={participantName}
          onBackToHome={() => window.location.reload()}
        />
      );
    }
  }

  return null;
}
