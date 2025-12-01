# Blockchain Simulation Game 🎮⛓️

Jeu éducatif interactif pour apprendre les concepts de la blockchain à travers des défis pratiques : validation de smart contracts, mining proof-of-work, et gouvernance DAO.

## ✨ Fonctionnalités Principales

### 🎮 Mode Solo Complet
- **100 Smart Contracts** : Base de données de 50 contrats valides et 50 invalides
- **Validation par Bots** : 8 validateurs automatisés analysent votre choix
- **Mining Challenge** : Trouvez le nonce avec Proof of Work simplifié
- **Vote DAO** : Système de gouvernance décentralisée avec votes pondérés
- **Système de Points** : Accumulation de points à travers les 3 étapes
- **Badges et Achievements** : Débloquez des badges selon vos performances

### 🏛️ Mode DAO Builder

Apprenez la gouvernance décentralisée en créant et participant à une Organisation Autonome Décentralisée (DAO) :

- **Création de DAO** : Configurez les paramètres de gouvernance (tokens, quorum, seuils)
- **Tokens de gouvernance** : Chaque membre reçoit des tokens pour voter
- **Propositions** : Tout membre peut créer une proposition (financement, paramètres, général)
- **Vote pondéré** : Le poids du vote dépend des tokens détenus
- **Quorum et approbation** : Règles configurables pour valider les propositions
- **Treasury** : Budget géré collectivement par les membres
- **Exécution** : Les propositions approuvées sont exécutées automatiquement

### 🎓 Mode Classe (2 variantes)

#### Mode Équipe
- **Groupes automatiques** : Formation de groupes de 4 (3 votants + 1 validateur)
- **Vote en équipe** : Les 3 membres votent pour choisir le smart contract
- **Validation croisée** : Chaque validateur évalue les choix des autres équipes
- **Mining collaboratif** : Top 20% des équipes qualifiées, 40 tentatives par équipe (10/membre)
- **Vote DAO final** : Top 2 équipes participent au vote individuel pondéré
- **Classement final** : Podium et résultats détaillés

#### Mode Solo en Classe
- **Responsable** : Crée une classe et obtient un code à partager
- **Joueurs indépendants** : Chaque participant progresse à son rythme
- **Validation bot** : 8 bots évaluent le choix (min 2 pour continuer)
- **Mining individuel** : 10 tentatives, nonce 0-20
- **Élimination** : Les joueurs peuvent être éliminés mais sauvegardent leur progression
- **Tableau de bord** : Le responsable voit la progression de tous en temps réel
- **Vote DAO final** : Seuls les joueurs ayant terminé participent

### Technologies
- **Frontend** : React 18 + Vite + CSS moderne avec animations
- **Backend** : Node.js + Express + CORS
- **Architecture** : SPA (Single Page Application) avec état géré par hooks
- **Déploiement** : Docker + Docker Compose prêt pour production

## 📁 Structure du Projet

```
.
├── backend/                      # Serveur Node.js
│   ├── server.js                 # API Express (validation, mining, voting)
│   ├── smartContracts.js         # Base de 100 smart contracts
│   ├── package.json              # Dépendances backend
│   └── Dockerfile                # Image Docker backend
│
├── frontend/                     # Application React
│   ├── src/
│   │   ├── App.jsx               # Router principal et gestion d'état
│   │   ├── LandingPage.jsx       # Page d'accueil
│   │   ├── SoloGame.jsx          # Saisie du nom du joueur
│   │   ├── SoloContractChoice.jsx # Choix de smart contract + validation
│   │   ├── MiningChallenge.jsx   # Défi de mining avec PoW
│   │   ├── VotingChallenge.jsx   # Vote DAO décentralisé
│   │   ├── Results.jsx           # Récapitulatif complet du parcours
│   │   ├── index.css             # Styles globaux avec thème sombre
│   │   └── main.jsx              # Point d'entrée React
│   ├── index.html
│   ├── vite.config.js            # Configuration Vite
│   ├── package.json              # Dépendances frontend
│   └── Dockerfile                # Image Docker frontend
│
├── docker-compose.yml            # Orchestration dev
├── docker-compose.prod.yml       # Orchestration production
└── README.md                     # Documentation
```

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js 18+** et **npm**
- **Docker et Docker Compose** (optionnel, pour le déploiement)

### Option 1 : Développement Local (Recommandé)

1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/votre-utilisateur/Blockchain-Simulation-Game.git
   cd Blockchain-Simulation-Game
   ```

2. **Installez les dépendances** :
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Lancez l'application** :

   **Terminal 1** (Backend) :
   ```bash
   cd backend
   node server.js
   # Serveur lancé sur http://localhost:4000
   ```

   **Terminal 2** (Frontend) :
   ```bash
   cd frontend
   npm run dev
   # Application disponible sur http://localhost:5173
   ```

4. **Accédez à l'application** : Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur

### Option 2 : Démarrage avec Docker

```bash
# Mode développement
docker-compose up --build

# Mode production
docker-compose -f docker-compose.prod.yml up --build
```

**Ports** :
- Frontend : http://localhost:3000 (Docker) ou http://localhost:5173 (Vite)
- Backend : http://localhost:4000

## 🎮 Déroulement du Jeu (Mode Solo)

### 1️⃣ Page d'Accueil
- Présentation du jeu éducatif blockchain
- Bouton "Mode Solo" pour commencer

### 2️⃣ Saisie du Nom
- Le joueur entre son nom
- Animation de transition

### 3️⃣ Validation Smart Contract (Étape 1)
- **Choix** : 2 smart contracts proposés (1 valide, 1 invalide)
- **Validation** : 8 bots analysent automatiquement votre choix
- **Points** :
  - Bon choix : **+10 points**
  - Mauvais choix : **+3 points** (pour la tentative)
  - **+2 points** par validateur en accord

### 4️⃣ Mining Challenge (Étape 2)
- **Question blockchain** : Répondez pour débloquer un indice
- **Bloc visuel** : Visualisation complète du bloc (height, timestamp, hash, nonce, transactions)
- **Trouvez le nonce** : Proof of Work simplifié (0-20)
- **Points** :
  - 1ère tentative : **+20 points** 🌟
  - 2-3 tentatives : **+15 points**
  - 4-6 tentatives : **+10 points**
  - 7-10 tentatives : **+5 points**

### 5️⃣ Vote DAO (Étape 3)
- **Gouvernance décentralisée** : 9 participants (vous + 8 bots)
- **Vote manuel** : Vous votez POUR ou CONTRE chaque bot
- **Vote automatique** : Les bots votent ensuite automatiquement
- **Votes pondérés** : Le poids dépend du score accumulé (score ÷ 10)
- **Calcul** :
  - Vote POUR : **+3 × poids**
  - Vote CONTRE : **-1 × poids**

### 6️⃣ Résultats du Vote
- Classement final des 9 participants
- Votre position (#1 à #9)
- Détail des votes POUR et CONTRE reçus
- Score final après votes

### 7️⃣ Récapitulatif Complet
- **Résumé du Vote DAO** : Classement, score, votes
- **Récapitulatif des 3 étapes** :
  - ✅ Validation Smart Contract
  - ⛏️ Mining Challenge
  - 🗳️ Vote DAO
- **Score total** du parcours
- **Badges obtenus** :
  - 🎯 **Validateur Expert** (contrat correct)
  - ⛏️ **Mineur Efficace** (≤3 tentatives)
  - 🏆 **Top 3 DAO** (classement ≤3)
  - ⭐ **Score d'Excellence** (score ≥100)

## 🎯 Système de Points et Scoring

| Étape | Action | Points |
|-------|--------|--------|
| **Validation** | Smart contract correct | +10 |
| **Validation** | Smart contract incorrect | +3 |
| **Validation** | Par validateur en accord | +2 |
| **Mining** | 1ère tentative | +20 |
| **Mining** | 2-3 tentatives | +15 |
| **Mining** | 4-6 tentatives | +10 |
| **Mining** | 7-10 tentatives | +5 |
| **Vote DAO** | Vote POUR reçu | +(score votant ÷ 10) × 3 |
| **Vote DAO** | Vote CONTRE reçu | -(score votant ÷ 10) |

**Score maximum théorique** : ~130+ points (selon les votes DAO)

## 🎓 Déroulement du Mode Classe

### Mode Équipe

#### 1️⃣ Création et Inscription
- **Responsable** : Crée la classe, obtient un code 6 caractères
- **Participants** : Rejoignent avec le code et leur nom
- **Formation** : Groupes de 4 automatiques (3 votants + 1 validateur)

#### 2️⃣ Vote en Équipe
- Les 3 votants choisissent parmi les smart contracts proposés
- Vote majoritaire détermine le choix de l'équipe
- Chaque équipe a son logo et son nom

#### 3️⃣ Validation Croisée
- Chaque validateur évalue les choix des **autres** équipes
- **Points** : +5 si validation correcte, -3 si incorrecte
- Équipes gagnent +10 pour un bon choix de contrat

#### 4️⃣ Mining Collaboratif
- **Qualification** : Top 20% des équipes (minimum 1)
- **Nonce** : Entre 0 et 100
- **Tentatives** : 10 par membre, 40 total pour une équipe de 4
- **Points selon le rang** :
  - 1ère équipe : **+30 points**
  - 2ème équipe : **+20 points**
  - 3ème équipe : **+15 points**
  - 4ème équipe : **+10 points**
  - Autres : **+5 points**

#### 5️⃣ Vote DAO Final
- **Qualification** : Top 2 équipes uniquement
- **Vote individuel** : Chaque membre vote pour/contre les autres membres
- **Poids** : Score d'équipe ÷ nombre de membres + bonus mineur
- **Calcul** : Vote POUR = +3×poids, Vote CONTRE = -1×poids

#### 6️⃣ Résultats Finaux
- Podium des 3 premiers
- Classement complet avec scores
- Statistiques de la classe

### Mode Solo en Classe

#### 1️⃣ Création et Inscription
- **Responsable** : Crée la classe en mode "Solo", obtient un code
- **Joueurs** : Rejoignent individuellement et commencent immédiatement

#### 2️⃣ Choix du Smart Contract
- 2 contrats proposés (1 valide, 1 invalide)
- 8 bots valident le choix
- **Élimination** : Si moins de 2 bots approuvent
- **Points** : +10 pour bon choix

#### 3️⃣ Mining Challenge
- **Nonce** : Entre 0 et 20
- **Tentatives** : 10 maximum
- **Élimination** : Si toutes les tentatives épuisées
- **Points** :
  - ≤3 tentatives : **+20 points**
  - 4-6 tentatives : **+10 points**
  - 7-10 tentatives : **+5 points**

#### 4️⃣ Tableau de Bord Responsable
- Vue en temps réel de tous les joueurs
- Statistiques : En choix, en mining, terminés, éliminés
- Détails : Contrat choisi, validations, tentatives, score
- Bouton pour lancer le vote DAO quand ≥2 joueurs terminés

#### 5️⃣ Vote DAO Final
- **Participants** : Uniquement les joueurs ayant terminé
- **Vote** : Chacun vote POUR/CONTRE les autres
- **Poids** : Score accumulé ÷ 10
- **Calcul** : Vote POUR = +3×poids, Vote CONTRE = -1×poids

#### 6️⃣ Résultats Finaux
- Podium des 3 premiers
- Classement complet
- Détails des votes et scores

## 🏛️ Déroulement du Mode DAO Builder

### Phase 1 : Configuration (Responsable)

#### 1️⃣ Création du DAO
- Nom et description du DAO
- Configuration du token de gouvernance (nom, symbole)
- Nombre de tokens par membre (ex: 100 tokens)

#### 2️⃣ Paramètres de Gouvernance
- **Quorum minimum** : % de tokens devant participer (ex: 50%)
- **Seuil d'approbation** : % de votes POUR requis (ex: 51%, 66%, 75%)
- **Durée des votes** : Temps alloué pour voter (1 min - 24h)
- **Treasury** : Budget initial disponible (ex: 10,000 unités)

### Phase 2 : Inscription des Membres

#### 3️⃣ Rejoindre le DAO
- Les étudiants rejoignent avec le code 6 caractères
- Distribution automatique des tokens à l'inscription
- Visualisation en temps réel des membres et tokens distribués

#### 4️⃣ Activation du DAO
- Minimum 2 membres requis
- Le responsable active le DAO
- Passage en mode "actif" - les propositions deviennent possibles

### Phase 3 : Propositions et Votes

#### 5️⃣ Créer une Proposition
**Tout membre peut créer :**
- **Proposition de financement** : Demande de fonds du treasury
- **Proposition de paramètres** : Modification des règles du DAO
- **Proposition générale** : Tout autre sujet

**Règles :**
- 1 proposition active par membre maximum
- Montant ne peut pas dépasser le treasury
- Durée de vote définie par les paramètres du DAO

#### 6️⃣ Voter sur les Propositions
- Chaque membre vote : **POUR** / **CONTRE** / **ABSTENTION**
- **Poids du vote** = nombre de tokens détenus
- Vote pondéré : Un membre avec 100 tokens pèse plus qu'un avec 50

**Calcul du résultat :**
- **Participation** = (Total votes / Total tokens) × 100
- **Quorum atteint** si participation ≥ quorum configuré
- **Proposition approuvée** si % POUR ≥ seuil d'approbation

#### 7️⃣ Exécution des Propositions
- Les propositions approuvées passent en statut "passed"
- Les propositions de financement déduisent du treasury
- Les propositions rejetées (quorum non atteint ou votes insuffisants)
- Historique complet conservé

### Phase 4 : Gouvernance Continue

#### 8️⃣ Tableau de Bord en Temps Réel
**Pour chaque membre :**
- Visualisation de ses tokens et pouvoir de vote
- Liste des propositions actives
- Historique des votes (approuvés/rejetés)
- Statut du treasury

**Statistiques affichées :**
- Propositions actives avec compteur de temps restant
- Résultats en temps réel (POUR, CONTRE, ABSTENTION)
- Taux de participation au vote
- Atteinte du quorum visualisée

## 🧠 Concepts Blockchain Enseignés

- **Smart Contracts** : Identification de vulnérabilités (reentrancy, overflow, accès non autorisé)
- **Proof of Work** : Minage de blocs avec recherche de nonce
- **Hashing** : Calcul de hash de blocs (algorithme simplifié)
- **DAO Governance** : Vote décentralisé avec pondération
- **Consensus** : Validation par multiples nœuds (bots validateurs)
- **Blockchain Structure** : Blocs, transactions, previous hash, timestamp

## 🗄️ Données et Stockage

- **Backend** : Stockage en mémoire (RAM) pendant la session
- **Frontend** : État React local (hooks useState)
- **Persistance** : Aucune (redémarrage = reset complet)
- **Base de données** : 100 smart contracts hardcodés dans `smartContracts.js`

## 🚀 Déploiement Production

### Sur VPS (DigitalOcean, AWS EC2, etc.)

1. **Prérequis** : Docker + Docker Compose installés
2. **Clonez le repo** :
   ```bash
   git clone https://github.com/votre-utilisateur/Blockchain-Simulation-Game.git
   cd Blockchain-Simulation-Game
   ```
3. **Lancez en production** :
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```
4. **Configurez le reverse proxy** (Nginx) pour exposer le port 3000

### Sur Plateformes Cloud
Compatible avec :
- **Heroku** : Buildpacks Node.js
- **Vercel/Netlify** : Frontend uniquement (nécessite backend séparé)
- **Google Cloud Run** : Containers Docker
- **AWS ECS/Fargate** : Orchestration de containers
- **DigitalOcean App Platform** : Déploiement automatique

## 📝 Scripts Disponibles

### Backend
```bash
npm start          # Lance le serveur Express (port 4000)
```

### Frontend
```bash
npm run dev        # Mode développement (Vite, port 5173)
npm run build      # Build de production
npm run preview    # Preview du build
```

## 🛠️ Stack Technique Détaillée

### Frontend
- **React 18** : Hooks (useState, useEffect)
- **Vite 4.5** : Build ultra-rapide, HMR
- **CSS Vanilla** : Variables CSS, animations, responsive
- **Fetch API** : Requêtes HTTP vers le backend

### Backend
- **Express 4.21** : Framework Node.js
- **CORS** : Cross-Origin Resource Sharing
- **Body-parser** : Parsing JSON
- **Architecture REST** : Endpoints `/api/...`

### DevOps
- **Docker** : Containerisation
- **Docker Compose** : Orchestration multi-services
- **Multi-stage builds** : Optimisation des images

## 📄 Licence

Projet éducatif sous **licence MIT**. Libre d'utilisation et modification.

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📧 Contact

Pour toute question ou suggestion, ouvrez une **issue** sur GitHub.

---

**Développé avec ❤️ pour l'éducation blockchain**
