# 📦 Guide de Création de Release GitHub

Ce guide vous explique comment créer une release professionnelle sur GitHub pour présenter votre projet Blockchain Simulation Game.

## 🎯 Étapes pour Créer une Release

### 1. Accéder à la Section Releases

1. Allez sur votre dépôt GitHub : `https://github.com/zakeelm6/Blockchain-Simulation-Game`
2. Cliquez sur **"Releases"** dans le menu de droite (ou allez directement à `/releases`)
3. Cliquez sur le bouton **"Create a new release"** (ou "Draft a new release")

### 2. Créer un Tag de Version

#### Format de Version Recommandé : Semantic Versioning (SemVer)

```
v1.0.0
```

**Structure : `vMAJOR.MINOR.PATCH`**
- **MAJOR** : Changements incompatibles avec versions précédentes (ex: v1 → v2)
- **MINOR** : Nouvelles fonctionnalités compatibles (ex: v1.0 → v1.1)
- **PATCH** : Corrections de bugs (ex: v1.0.0 → v1.0.1)

**Pour votre projet, commencez par :**
```
v1.0.0 - Release Initiale
```

#### Comment Créer le Tag

1. Dans le champ **"Choose a tag"**, tapez : `v1.0.0`
2. Cliquez sur **"+ Create new tag: v1.0.0 on publish"**
3. Assurez-vous que la branche cible est **`main`**

### 3. Titre de la Release

Utilisez un titre descriptif et engageant :

```
🎮 Blockchain Simulation Game v1.0.0 - Release Initiale
```

**Exemples de titres pour futures releases :**
- `v1.1.0 - Ajout du Mode Solo en Salle`
- `v1.2.0 - Nouveau Mode DAO Builder`
- `v1.0.1 - Corrections de bugs et améliorations`

### 4. Description de la Release

Utilisez le format Markdown suivant pour une présentation professionnelle :

```markdown
# 🎮 Blockchain Simulation Game - Version 1.0.0

Jeu éducatif interactif pour apprendre les concepts de la blockchain à travers des défis pratiques.

## ✨ Fonctionnalités Principales

### 🎮 Mode Solo
- **100 Smart Contracts** : 50 valides + 50 invalides
- **Validation par 8 Bots** : Analyse automatique de votre choix
- **Mining Challenge** : Proof of Work simplifié
- **Vote DAO** : Gouvernance décentralisée
- **Système de Points & Badges** : Gamification complète

### 🎯 Mode Solo en Salle
- **Salle partagée** : Hôte + Joueurs avec clé d'accès unique
- **Progression individuelle** : Chacun joue à son rythme
- **Dashboard temps réel** : Supervision complète par l'hôte
- **Classement dynamique** : Mise à jour toutes les 2 secondes
- **Statistiques détaillées** : En jeu, Terminés, Éliminés

### 🎓 Mode Classe (2 variantes)
- **Mode Équipe** : Groupes de 4 avec vote collectif
- **Mode Solo en Classe** : Progression individuelle supervisée
- **Validation croisée** : Les validateurs évaluent les autres équipes
- **Mining collaboratif** : Top 20% qualifiés
- **Vote DAO final** : Système de gouvernance pondéré

### 🏛️ Mode DAO Builder
- **Configuration complète** : Tokens, quorum, seuils d'approbation
- **Propositions** : Financement, paramètres, général
- **Vote pondéré** : Selon les tokens détenus
- **Treasury** : Gestion collective des fonds
- **Exécution automatique** : Les propositions approuvées

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

\`\`\`bash
# Cloner le dépôt
git clone https://github.com/zakeelm6/Blockchain-Simulation-Game.git
cd Blockchain-Simulation-Game

# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
\`\`\`

### Démarrage

\`\`\`bash
# Terminal 1 - Backend
cd backend
npm start
# Backend: http://localhost:4000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Frontend: http://localhost:5173
\`\`\`

## 📦 Déploiement avec Docker

\`\`\`bash
# Mode développement
docker-compose up -d

# Mode production
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

Accédez à : `http://localhost`

## 🧠 Concepts Blockchain Enseignés

- ✅ **Smart Contracts** : Identification de vulnérabilités
- ✅ **Proof of Work** : Minage de blocs avec nonce
- ✅ **Hashing** : Calcul de hash de blocs
- ✅ **DAO Governance** : Vote décentralisé pondéré
- ✅ **Consensus** : Validation par multiples nœuds
- ✅ **Blockchain Structure** : Blocs, transactions, hashes

## 🎯 Public Cible

- 🎓 **Étudiants** : Découverte interactive de la blockchain
- 👨‍🏫 **Enseignants** : Outil pédagogique clé en main
- 💼 **Entreprises** : Formation technique blockchain
- 🚀 **Développeurs** : Apprentissage ludique des concepts

## 📚 Documentation Complète

Consultez le [README](https://github.com/zakeelm6/Blockchain-Simulation-Game#readme) pour :
- Déroulement détaillé de chaque mode
- Architecture technique complète
- Guide de déploiement production
- API et endpoints backend

## 🐛 Bugs Connus

Aucun bug majeur connu à ce jour.

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

Développé avec ❤️ par [Zakeel M](https://github.com/zakeelm6)

---

**Note :** Pour toute question ou support, ouvrez une [issue](https://github.com/zakeelm6/Blockchain-Simulation-Game/issues).
```

### 5. Ajouter des Assets (Optionnel)

Vous pouvez ajouter des fichiers à télécharger :

#### Fichiers Recommandés :
1. **Code source (automatique)** : GitHub génère automatiquement `Source code.zip` et `Source code.tar.gz`
2. **Build frontend** : Package `frontend/dist` en `blockchain-game-frontend-v1.0.0.zip`
3. **Documentation PDF** : Export du README en PDF
4. **Images/Screenshots** : Captures d'écran des différents modes

#### Comment Créer un Package Frontend :

```bash
cd frontend
npm run build
cd dist
zip -r ../../blockchain-game-frontend-v1.0.0.zip .
```

Ensuite, uploadez ce fichier dans la section "Attach binaries" de la release.

### 6. Options Supplémentaires

#### ☑️ Set as the latest release
- **Cochez** cette option pour v1.0.0 (première release)

#### ☑️ Create a discussion for this release
- **Cochez** pour permettre aux utilisateurs de commenter
- Catégorie recommandée : "Announcements"

#### ⬜ Set as a pre-release
- **Ne cochez PAS** pour une release stable
- Utilisez uniquement pour v1.0.0-beta, v1.0.0-rc1, etc.

### 7. Publier la Release

1. Vérifiez que tout est correct
2. Cliquez sur **"Publish release"**
3. La release apparaîtra dans la section "Releases" de votre dépôt

## 📊 Configuration de la Section "About"

### 1. Ajouter une Description

Sur la page principale de votre dépôt :

1. Cliquez sur l'icône ⚙️ (Settings) à côté de "About" (en haut à droite)
2. Remplissez les champs :

**Description :**
```
🎮 Jeu éducatif interactif pour apprendre la blockchain : Smart Contracts, Mining PoW, Gouvernance DAO
```

**Website :**
```
https://zakeelm6.github.io/Blockchain-Simulation-Game
```
(Si vous déployez sur GitHub Pages)

**Topics (Tags) :**
```
blockchain
education
smart-contracts
dao
proof-of-work
react
nodejs
game
learning
cryptocurrency
solidity
mining
governance
interactive
educational-game
```

3. Cochez :
   - ☑️ **Releases** : Affiche le nombre de releases
   - ☑️ **Packages** : Si vous publiez des packages npm/docker

4. Cliquez sur **"Save changes"**

## 🎨 Personnalisation Avancée

### Ajouter un Badge de Release

Dans votre `README.md`, ajoutez en haut :

```markdown
[![GitHub release](https://img.shields.io/github/v/release/zakeelm6/Blockchain-Simulation-Game)](https://github.com/zakeelm6/Blockchain-Simulation-Game/releases)
[![License](https://img.shields.io/github/license/zakeelm6/Blockchain-Simulation-Game)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/zakeelm6/Blockchain-Simulation-Game)](https://github.com/zakeelm6/Blockchain-Simulation-Game/stargazers)
```

### Créer un CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-XX

### Added
- Mode Solo avec 100 smart contracts
- Mode Solo en Salle avec dashboard temps réel
- Mode Classe (Équipe + Solo en Classe)
- Mode DAO Builder
- Système de points et badges
- Mining Challenge avec Proof of Work
- Vote DAO avec gouvernance pondérée

### Features
- Validation automatique par 8 bots
- Classement dynamique en temps réel
- Interface responsive moderne
- Support Docker pour déploiement facile
```

## 📦 Publier un Package (Optionnel)

### Docker Hub

Si vous voulez publier vos images Docker :

1. Créez un compte sur [Docker Hub](https://hub.docker.com)
2. Buildez et taguez vos images :

```bash
docker build -t zakeelm6/blockchain-game-frontend:1.0.0 ./frontend
docker build -t zakeelm6/blockchain-game-backend:1.0.0 ./backend
```

3. Publiez sur Docker Hub :

```bash
docker push zakeelm6/blockchain-game-frontend:1.0.0
docker push zakeelm6/blockchain-game-backend:1.0.0
```

4. La section "Packages" s'affichera automatiquement sur GitHub

### GitHub Container Registry (GHCR)

Alternative à Docker Hub avec intégration GitHub native :

```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u zakeelm6 --password-stdin

# Tag
docker tag blockchain-game-frontend ghcr.io/zakeelm6/blockchain-game-frontend:1.0.0

# Push
docker push ghcr.io/zakeelm6/blockchain-game-frontend:1.0.0
```

## 🎯 Checklist Finale

Avant de publier votre release :

- [ ] Code testé et fonctionnel
- [ ] README.md à jour avec toutes les fonctionnalités
- [ ] CHANGELOG.md créé et rempli
- [ ] Version correctement taggée (v1.0.0)
- [ ] Description de release complète et formatée
- [ ] Screenshots/assets ajoutés si disponibles
- [ ] Section "About" configurée
- [ ] Licence ajoutée (LICENSE file)
- [ ] .gitignore configuré correctement
- [ ] Documentation déployée (GitHub Pages optionnel)

## 📝 Exemples de Futures Releases

### v1.1.0 - Nouvelles Fonctionnalités

```markdown
## What's New

### Added
- 🌐 Support multilingue (FR/EN)
- 📊 Statistiques avancées pour les enseignants
- 💾 Sauvegarde de progression locale

### Improved
- ⚡ Performance du dashboard (+50% plus rapide)
- 🎨 Interface utilisateur modernisée
- 📱 Meilleure responsivité mobile

### Fixed
- 🐛 Correction du bug de reconnexion
- 🔧 Fix des validations en mode classe
```

### v1.0.1 - Patch

```markdown
## Bug Fixes

- Fix crash lors de la validation avec 0 bots
- Correction de l'affichage du classement
- Amélioration de la stabilité du serveur

## Documentation

- Ajout de screenshots dans le README
- Guide de contribution mis à jour
```

## 🚀 Promouvoir Votre Release

Une fois publiée :

1. **Twitter/LinkedIn** : Annoncez votre release avec #blockchain #education
2. **Dev.to** : Écrivez un article technique sur le développement
3. **Reddit** : Partagez sur r/blockchain, r/programming, r/learnprogramming
4. **Product Hunt** : Soumettez votre projet
5. **GitHub Topics** : Ajoutez des topics pertinents pour la découvrabilité

---

**Félicitations ! Votre release est maintenant professionnelle et prête à être partagée ! 🎉**
