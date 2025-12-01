import React, { useState } from 'react';

export function TeacherAccess({ onAccess, onBack }) {
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAccess() {
    if (!classCode.trim()) {
      setError('Veuillez entrer le code de la classe');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/class/${classCode.trim().toUpperCase()}`);
      const data = await response.json();

      if (data.ok && data.classroom) {
        // Vérifier que c'est bien un mode solo
        if (data.classroom.mode === 'solo') {
          onAccess(classCode.trim().toUpperCase(), data.classroom);
        } else {
          setError('Ce code n\'est pas pour un mode Solo en Classe');
        }
      } else {
        setError(data.error || 'Classe introuvable');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>👨‍🏫 Accès Responsable</h2>
      <p className="muted">Accédez au tableau de bord de votre classe Solo</p>

      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Code de la classe
          </label>
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="Ex: ABC123"
            maxLength={6}
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              letterSpacing: '0.15em',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && classCode && handleAccess()}
          />
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', textAlign: 'center' }}>
            Code à 6 caractères de votre classe
          </div>
        </div>

        {error && (
          <div className="notice error-notice" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="notice" style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <strong>ℹ️ Accès Responsable :</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            <li>Consultez la progression de tous les participants</li>
            <li>Suivez les éliminations en temps réel</li>
            <li>Lancez le vote DAO final quand vous êtes prêt</li>
            <li>Visualisez les résultats et le classement</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} disabled={loading}>
            Retour
          </button>
          <button onClick={handleAccess} disabled={loading || !classCode} style={{ flex: 1 }}>
            {loading ? 'Connexion...' : 'Accéder au Tableau de Bord'}
          </button>
        </div>
      </div>
    </section>
  );
}
