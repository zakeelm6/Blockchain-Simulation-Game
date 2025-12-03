# 🎮 Blockchain Simulation Game

Application web interactive pour apprendre la blockchain à travers deux activités éducatives ludiques.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 À propos

**Blockchain Simulation Game** est un outil pédagogique développé par le **Club IBC (Innovation Blockchain Club)** de l'INPT pour enseigner les concepts fondamentaux de la blockchain de manière interactive.

### 🎯 Objectifs pédagogiques

- Comprendre le rôle des **validateurs** dans un réseau blockchain
- Expérimenter la **validation de smart contracts**
- Découvrir la **gouvernance DAO** (Decentralized Autonomous Organization)
- Apprendre le concept de **Proof of Work** à travers le minting
- Comprendre les **votes pondérés** et la prise de décision décentralisée

---

## 🎮 Les Activités

### **Activité 1 : Smart Contract Validation**
Les participants doivent identifier et valider des smart contracts parmi plusieurs propositions. Un système de validation décentralisé simule le consensus d'un réseau blockchain.

**Concepts abordés :**
- Smart contracts
- Validation par consensus
- Proof of Stake (simplifié)
- Responsabilité et pénalités

### **Phase de Minting (Bonus)**
Une mini-compétition chronométrée (4 minutes) où les équipes "minent" un bloc pour gagner des points bonus.

**Concepts abordés :**
- Proof of Work
- Mining et récompenses
- Compétition dans un réseau

### **Activité 2 : DAO Governance**
Les participants utilisent leurs tokens accumulés pour voter sur d'autres équipes. Les votes sont pondérés selon le nombre de tokens détenus.

**Concepts abordés :**
- Gouvernance décentralisée (DAO)
- Votes pondérés par tokens
- Transparence blockchain
- Réputation dans un réseau

---

## 🚀 Installation

### Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **Git**

### Cloner le projet

```bash
git clone https://github.com/zakeelm6/Blockchain-Simulation-Game.git
cd Blockchain-Simulation-Game
```

---

## 💻 Utilisation Locale

### Avec Docker (Recommandé)

```bash
# Lancer l'application complète
docker-compose up

# Accéder à l'application
# Frontend : http://localhost:5173
# Backend : http://localhost:4000
```

### Sans Docker

#### 1. Démarrer le Backend

```bash
cd backend
npm install
npm start
```

Le backend sera accessible sur `http://localhost:4000`

#### 2. Démarrer le Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

---

## 🎓 Modes de Jeu

### Mode Solo
Parfait pour découvrir le jeu individuellement. Le joueur est accompagné de 8 validateurs bots qui évaluent ses choix.

### Mode Classe
Jusqu'à 8 équipes peuvent jouer simultanément. Idéal pour des sessions en classe avec :
- Sélection de cryptomonnaies par équipe
- Compétition entre équipes
- Scores en temps réel

### Mode DAO
Mode avancé centré sur la gouvernance décentralisée et les votes collectifs.

---

## 📁 Structure du Projet

```
Blockchain-Simulation-Game/
├── frontend/              # Application React
│   ├── src/
│   │   ├── App.jsx       # Composant principal
│   │   ├── SoloGame.jsx  # Mode solo
│   │   ├── Activity1.jsx # Validation de smart contracts
│   │   ├── Minting.jsx   # Phase de minting
│   │   └── ...
│   └── index.html
├── backend/              # API Node.js + Express
│   └── server.js
├── assets/               # Images et logos
└── docker-compose.yml    # Configuration Docker
```

---

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **CSS personnalisé** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **CORS** - Gestion des requêtes cross-origin

### Infrastructure
- **Docker** - Conteneurisation
- **nginx** - Serveur web (production)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Équipe

Développé avec ❤️ par le **Club IBC - INPT**

**Club IBC** (Innovation Blockchain Club) - Club étudiant de l'Institut National des Postes et Télécommunications dédié à l'apprentissage et à l'expérimentation de la blockchain.

---

## 📞 Contact

Pour toute question ou suggestion :
- 📧 Email : [votre-email@inpt.ac.ma]
- 🌐 Site web : [votre-site-club.com]
- 💬 Discord : [lien-discord]

---

## 🙏 Remerciements

- Tous les membres du Club IBC
- L'équipe pédagogique de l'INPT
- La communauté blockchain marocaine

---

<div align="center">
  <strong>🎓 Apprendre la blockchain en s'amusant ! 🚀</strong>
</div>
