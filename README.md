# 🎮 Blockchain Simulation Game

Application web interactive pour apprendre la blockchain à travers deux activités ludiques :
- **Activité 1** : Validation de smart contracts
- **Activité 2** : Gouvernance DAO avec votes pondérés

## 🚀 Déploiement rapide (pour les étudiants)

**📖 Consultez le guide complet : [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**

### Déploiement sur Render.com (GRATUIT)

1. Poussez le code sur GitHub
2. Créez un compte sur https://render.com
3. Connectez votre dépôt GitHub
4. Render déploiera automatiquement via `render.yaml`
5. Partagez le lien généré aux étudiants !

**⏱️ Temps total : 10 minutes**

---

## 💻 Développement local

### Avec Docker (recommandé)

```bash
# Lancer le projet
docker-compose up

# Frontend : http://localhost:5173
# Backend : http://localhost:4000
```

### Sans Docker

**Backend :**
```bash
cd backend
npm install
npm start
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Structure du projet

```
Blockchain-Simulation-Game/
├── frontend/          # Application React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Activity1.jsx
│   │   ├── SoloGame.jsx
│   │   ├── Minting.jsx
│   │   ├── Scoreboard.jsx
│   │   └── ...
│   └── index.html
├── backend/           # API Express.js
│   └── server.js
├── assets/            # Images (logos cryptos)
├── render.yaml        # Configuration Render.com
└── docker-compose.yml # Configuration Docker
```

---

## 🎯 Fonctionnalités

### Mode Solo
- Choix de smart contract (1 vrai + 1 faux)
- Validation par 8 bots simulés
- Progression basée sur les validations

### Mode Classe
- Jusqu'à 8 équipes
- Sélection de cryptomonnaies
- Timer de minting (4 minutes)
- Votes pondérés par tokens
- Tableau des scores en temps réel

---

## 📊 Technologies

- **Frontend** : React 18, Vite
- **Backend** : Node.js, Express
- **Styling** : CSS personnalisé
- **Déploiement** : Render.com, Docker

---

## 📧 Contact

Pour toute question : Club IBC - INPT

---

## 📄 Licence

MIT License
