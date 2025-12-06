# 🎮 Blockchain Simulation Game

**Plateforme éducative interactive pour apprendre la blockchain en s'amusant**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

> 🎓 Développé par le **Club IBC (INPT Blockchain Club)** de l'INPT pour rendre l'apprentissage de la blockchain accessible et ludique.

---

## 🚀 Démarrage Rapide

```bash
# 1. Cloner le projet
git clone https://github.com/zakeelm6/Blockchain-Simulation-Game.git
cd Blockchain-Simulation-Game

# 2. Lancer avec Docker (recommandé)
docker-compose up

# ✅ Accéder à l'application
# Frontend : http://localhost:5173
# Backend  : http://localhost:4000
```



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

## ✨ Fonctionnalités

- 🎮 **4 modes de jeu** : Solo, Solo en Salle, Classe, DAO Builder
- 🤖 **8 validateurs automatiques** pour simulation réaliste du réseau
- ⛏️ **Mining interactif** avec Proof of Work simplifié (recherche de nonce)
- 🗳️ **Système de vote DAO** avec votes pondérés par score
- 📊 **Dashboard temps réel** pour le suivi multi-joueurs
- 🏆 **Classements automatiques** avec calcul dynamique des scores
- 🔐 **Salles sécurisées** avec clés d'accès (6 caractères)
- 📱 **Interface responsive** adaptée à tous les écrans
- 🎯 **42 endpoints REST** pour une API complète
- 👥 **Mode équipe** avec validation collaborative
- 🏛️ **Gouvernance DAO** avec propositions et exécution automatique
- 📚 **Smart contracts Solidity** réels pour l'apprentissage

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

### 🎯 Mode Solo
Parfait pour découvrir le jeu individuellement. Le joueur suit un parcours complet :
1. **Choix de smart contract** : Identifier le contrat valide
2. **Validation par 8 bots** : Les validateurs automatiques évaluent votre choix (minimum 2 requis)
3. **Challenge Mining** : Résoudre un puzzle de Proof of Work
4. **Vote DAO** : Participer au vote avec les autres validateurs

### 🎯 Mode Solo en Salle
Mode multijoueur avec progression individuelle, idéal pour les enseignants :
- **Un hôte** crée une salle et obtient une clé d'accès (6 caractères)
- **Les joueurs** rejoignent avec la clé et jouent individuellement
- **Chaque joueur** progresse à son rythme dans le challenge complet
- **Dashboard temps réel** : L'hôte suit la progression de tous les participants
- **Classement automatique** : Scores et statistiques en direct
- Parfait pour des cours, ateliers ou compétitions

### 👥 Mode Classe
Jusqu'à 8 équipes jouent simultanément en mode collaboratif :
- Sélection de cryptomonnaies par équipe
- Compétition entre équipes
- Scores en temps réel
- Activités synchronisées

### 🏛️ DAO Builder
Mode avancé de gouvernance décentralisée :
- Création d'organisations DAO autonomes
- Système de propositions et votes pondérés
- Exécution automatique des décisions
- Gestion de trésorerie collective
- Formation à la gouvernance on-chain

---

## 🎯 Focus : Mode Solo en Salle

Le **Mode Solo en Salle** est parfait pour les enseignants, formateurs et organisateurs d'ateliers.

### Comment ça marche ?

#### 1️⃣ Création de la Salle (Hôte)
- L'hôte crée une salle en donnant un nom
- Le système génère une **clé d'accès unique** (6 caractères)
- L'hôte partage cette clé avec les participants

#### 2️⃣ Connexion des Joueurs
- Chaque joueur entre la clé de 6 caractères
- Ils créent leur nom de joueur
- Ils rejoignent la salle et apparaissent sur le dashboard de l'hôte

#### 3️⃣ Jeu Individuel
Chaque joueur progresse à son rythme dans le parcours complet :
1. **Smart Contract** : Choisir entre 2 contrats (valide/invalide)
2. **Validation** : 8 bots votent (minimum 2 requis pour passer)
3. **Mining** : Résoudre un puzzle PoW chronométré
4. **Vote DAO** : Voter pour/contre les autres validateurs

#### 4️⃣ Dashboard en Temps Réel
L'hôte voit en direct :
- **Statistiques globales** : Total joueurs, en jeu, terminés, éliminés
- **Classement live** : Score de chaque joueur mis à jour automatiquement
- **Progression** : Statut de chaque participant

### Calcul des Points

| Étape | Points gagnés |
|-------|--------------|
| Smart Contract valide | +30 points |
| Validation réussie (≥2 bots) | Passage à l'étape suivante |
| Mining réussi | +20 points |
| Vote DAO | Score final basé sur les votes reçus |

**Score maximum possible** : Variable selon les votes DAO (généralement 100-200 points)

### Cas d'usage

- 👨‍🏫 **Enseignants** : Cours interactif sur la blockchain
- 🏢 **Entreprises** : Formation des employés
- 🎓 **Universités** : TP et ateliers pratiques
- 🏆 **Événements** : Compétitions et hackathons

---

## 📁 Structure du Projet

```
Blockchain-Simulation-Game/
├── frontend/                    # Application React
│   ├── src/
│   │   ├── App.jsx             # Routeur principal
│   │   ├── LandingPage.jsx     # Page d'accueil (4 modes)
│   │   ├── apiClient.js        # Client API REST
│   │   │
│   │   ├── # Mode Solo
│   │   ├── SoloGame.jsx        # Orchestrateur mode solo
│   │   ├── SoloContractChoice.jsx # Choix smart contract
│   │   ├── BotValidator.jsx    # Validation par 8 bots
│   │   ├── MiningChallenge.jsx # Challenge mining PoW
│   │   ├── VotingChallenge.jsx # Vote DAO
│   │   ├── Results.jsx         # Écran résultats final
│   │   │
│   │   ├── # Mode Solo en Salle
│   │   ├── SoloRoomMode.jsx    # Orchestrateur solo room
│   │   ├── SoloRoomCreate.jsx  # Création de salle
│   │   ├── SoloRoomJoin.jsx    # Rejoindre salle
│   │   ├── SoloRoomDashboard.jsx # Dashboard hôte temps réel
│   │   ├── SoloRoomPlayer.jsx  # Interface joueur
│   │   │
│   │   ├── # Mode Classe
│   │   ├── ClassMode.jsx       # Orchestrateur mode classe
│   │   ├── ClassCreate.jsx     # Création classe
│   │   ├── ClassJoin.jsx       # Rejoindre classe
│   │   ├── ClassWaiting.jsx    # Salle d'attente
│   │   ├── ParticipantWaiting.jsx # Attente participant
│   │   ├── TeamVoting.jsx      # Vote en équipe
│   │   ├── TeamMining.jsx      # Mining en équipe
│   │   ├── ClassResults.jsx    # Résultats classe
│   │   ├── SoloClassMode.jsx   # Mode solo dans classe
│   │   ├── SoloClassPlayer.jsx # Joueur solo classe
│   │   ├── SoloClassDAO.jsx    # DAO solo classe
│   │   ├── SoloDashboard.jsx   # Dashboard solo classe
│   │   ├── ValidatorView.jsx   # Vue validateur
│   │   ├── IndividualVoting.jsx # Vote individuel
│   │   │
│   │   ├── # Mode DAO
│   │   ├── DAOMode.jsx         # Orchestrateur mode DAO
│   │   ├── DAOCreate.jsx       # Création DAO
│   │   ├── DAOJoin.jsx         # Rejoindre DAO
│   │   ├── DAOWaiting.jsx      # Salle d'attente DAO
│   │   ├── DAODashboard.jsx    # Dashboard DAO
│   │   │
│   │   ├── # Utilitaires
│   │   ├── TeacherAccess.jsx   # Accès enseignant
│   │   └── main.jsx            # Point d'entrée React
│   │
│   └── index.html
│
├── backend/                    # API Node.js + Express
│   ├── server.js              # Serveur avec 42 endpoints
│   └── smartContracts.js      # Base de données smart contracts
│
├── assets/                     # Images et logos
├── docker-compose.yml          # Configuration Docker
├── QUICK_START.md             # Guide démarrage rapide
├── LICENSE                     # Licence MIT
└── README.md                   # Ce fichier
```

---

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework UI moderne
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation
- **CSS personnalisé** - Styling responsive

### Backend
- **Node.js 16+** - Runtime JavaScript
- **Express.js** - Framework web minimaliste
- **CORS** - Gestion des requêtes cross-origin
- **API REST** - Architecture RESTful

### Infrastructure
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-conteneurs
- **nginx** - Serveur web (production)

---

## 📡 API Endpoints

L'application expose **42 endpoints REST** organisés par fonctionnalité :

### 🏥 Santé
- `GET /api/health` - Vérifier l'état du serveur

### 🎯 Mode Solo (Standalone)
- `GET /api/solo/contracts/pair` - Obtenir 2 smart contracts (1 valide, 1 invalide)
- `POST /api/solo/contracts/answer` - Soumettre le choix et obtenir la validation

### 🎯 Mode Solo en Salle (Multiplayer Individual)
- `POST /api/solo-room/create` - Créer une salle avec clé unique
- `GET /api/solo-room/:code` - Obtenir les infos d'une salle
- `POST /api/solo-room/:code/join` - Rejoindre une salle
- `POST /api/solo-room/:code/player/:playerName/update` - MAJ progression joueur
- `POST /api/solo-room/:code/finish` - Terminer et clôturer la salle

### 👥 Mode Classe (Team-based)
- `POST /api/class/create` - Créer une classe
- `POST /api/class/join` - Rejoindre une classe
- `GET /api/class/:code` - Obtenir infos classe
- `POST /api/class/:code/start` - Démarrer la classe
- `POST /api/class/:code/vote` - Vote collectif équipe
- `POST /api/class/:code/validate` - Valider les votes
- `POST /api/class/:code/mine` - Phase mining équipe
- `POST /api/class/:code/dao-vote` - Vote DAO en classe
- `POST /api/class/:code/solo/start` - Démarrer mode solo dans classe
- `POST /api/class/:code/solo/choose-contract` - Choix contrat solo classe
- `POST /api/class/:code/solo/mine` - Mining solo classe
- `POST /api/class/:code/solo/start-dao` - Démarrer DAO solo classe
- `POST /api/class/:code/solo/dao-vote` - Vote DAO solo classe

### 🏛️ Mode DAO (Governance)
- `POST /api/dao/create` - Créer une organisation DAO
- `GET /api/dao/:code` - Obtenir infos DAO
- `POST /api/dao/:code/join` - Rejoindre DAO
- `POST /api/dao/:code/activate` - Activer la DAO
- `POST /api/dao/:code/proposal/create` - Créer une proposition
- `POST /api/dao/:code/proposal/:proposalId/vote` - Voter sur proposition
- `POST /api/dao/:code/proposal/:proposalId/execute` - Exécuter proposition

### 📊 Activity 1 (Legacy - Mode Classe)
- `GET /api/activity1/teams` - Obtenir les équipes
- `POST /api/activity1/init` - Initialiser l'activité
- `POST /api/activity1/bump` - Mettre à jour scores équipe
- `POST /api/activity1/reset` - Réinitialiser activité
- `GET /api/activity1/eligible` - Obtenir équipes éligibles

### ⛏️ Minting
- `POST /api/mint/apply` - Appliquer récompenses mining

### 👥 Teams (Gestion équipes)
- `GET /api/teams` - Obtenir toutes les équipes
- `POST /api/teams/reset` - Réinitialiser équipes

### 🗳️ Votes & Résultats
- `GET /api/votes/log` - Historique complet des votes
- `POST /api/votes/submit` - Soumettre votes DAO
- `POST /api/votes/deleteOne` - Supprimer un vote
- `POST /api/votes/clear` - Effacer tous les votes
- `POST /api/votes/resetAggregates` - Réinitialiser agrégats
- `POST /api/results/compute` - Calculer résultats finaux

---

## 📸 Aperçu de l'Application

### Page d'Accueil
4 modes de jeu disponibles dès le lancement avec boutons colorés distinctifs :
- 🎮 **Mode Solo** (Bleu) - Apprentissage individuel
- 🎯 **Solo en Salle** (Vert) - Multijoueur individuel pour enseignants
- 🎓 **Mode Classe** (Violet) - Jeu en équipes collaboratives
- 🏛️ **DAO Builder** (Orange) - Gouvernance décentralisée avancée

### Mode Solo - Flux Complet
1. **Choix du Smart Contract** : 2 contrats proposés, 1 seul est valide
2. **Validation par Bots** : 8 validateurs automatiques votent
3. **Mining Challenge** : Résoudre un puzzle PoW chronométré
4. **Vote DAO** : Voter pour/contre les participants avec animation circulaire

### Mode Solo en Salle - Dashboard Hôte
- Statistiques en temps réel
- Classement dynamique des joueurs
- Suivi de la progression (En jeu / Terminé / Éliminé)
- Mise à jour automatique toutes les 2 secondes

---

## 🎯 Concepts Blockchain Implémentés

| Concept | Où dans l'app |
|---------|---------------|
| **Smart Contracts** | Choix et validation de contrats Solidity |
| **Consensus** | Validation par 8 bots (simulation réseau) |
| **Proof of Work** | Challenge mining avec nonce |
| **Proof of Stake** | Votes pondérés par score |
| **DAO Governance** | Vote collectif pour/contre |
| **Blockchain Network** | Simulation de 9 nœuds (joueur + 8 bots) |
| **Rewards** | Points pour smart contract et mining |
| **Penalties** | Élimination si validation échoue |

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

---

## ❓ FAQ

### Combien de joueurs peuvent participer ?
- **Mode Solo** : 1 joueur + 8 validateurs bots
- **Mode Solo en Salle** : Illimité (chaque joueur progresse individuellement)
- **Mode Classe** : Jusqu'à 8 équipes de 1-4 joueurs
- **DAO Builder** : Illimité (membres de l'organisation)

### Combien de temps dure une partie ?
- **Mode Solo** : 10-15 minutes (selon la vitesse du joueur)
- **Mode Solo en Salle** : Variable (chaque joueur à son rythme)
- **Mode Classe** : 20-30 minutes (avec mining et votes)

### Quels sont les prérequis pour jouer ?
Aucun ! L'application est conçue pour être accessible même sans connaissances préalables en blockchain.

### Puis-je utiliser l'application pour mes cours ?
Absolument ! C'est l'objectif principal. Le **Mode Solo en Salle** est spécifiquement conçu pour les enseignants.

### L'application est-elle gratuite ?
Oui, 100% gratuite et open-source sous licence MIT.

### Comment déployer en production ?
Voir [QUICK_START.md](QUICK_START.md) pour le déploiement avec Docker ou les guides de déploiement avec ngrok.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

**En résumé** : Vous pouvez librement utiliser, modifier et distribuer ce projet, y compris à des fins commerciales.

---

## 👥 Auteurs & Contributeurs

Développé avec ❤️ par le **Club IBC - INPT**

**Club IBC** (Innovation Blockchain Club) - Club étudiant de l'Institut National des Postes et Télécommunications dédié à l'apprentissage et à l'expérimentation de la blockchain.

### Mainteneurs
- **Zakaria El Malki** ([@zakeelm6](https://github.com/zakeelm6))

### Contributeurs
Merci à tous les [contributeurs](https://github.com/zakeelm6/Blockchain-Simulation-Game/graphs/contributors) qui ont participé à ce projet !

---

## 📞 Support & Contact

### Besoin d'aide ?
- 📖 Consultez d'abord le [QUICK_START.md](QUICK_START.md)
- 🐛 Signalez un bug via [GitHub Issues](https://github.com/zakeelm6/Blockchain-Simulation-Game/issues)
- 💡 Proposez une amélioration via [Pull Request](https://github.com/zakeelm6/Blockchain-Simulation-Game/pulls)

### Contact
- 📧 Email : [contact@inpt.ac.ma]
- 🌐 Site web : [Site du Club IBC]
- 💬 Discord : [Serveur Discord du Club]

---

## 🙏 Remerciements

- Tous les membres du **Club IBC**
- L'équipe pédagogique de l'**INPT**
- La communauté **blockchain marocaine**
- Les contributeurs open-source

---

## 🔗 Liens Utiles

- [Documentation React](https://react.dev/)
- [Documentation Express.js](https://expressjs.com/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Introduction à la Blockchain](https://ethereum.org/fr/what-is-ethereum/)
- [DAO Concepts](https://ethereum.org/fr/dao/)

---

<div align="center">

### 🎓 Apprendre la blockchain en s'amusant ! 🚀

**Star ⭐ ce projet si vous le trouvez utile !**

[![Made with ❤️ by Club IBC](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20by-Club%20IBC-blue)](https://github.com/zakeelm6)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/zakeelm6/Blockchain-Simulation-Game/pulls)

</div>
