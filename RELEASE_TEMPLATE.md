# 🎮 Blockchain Simulation Game - Version 1.0.0

Jeu éducatif interactif pour apprendre les concepts de la blockchain à travers des défis pratiques.

## ✨ Fonctionnalités Principales

### 🎮 Mode Solo
- **100 Smart Contracts** : 50 valides + 50 invalides
- **Validation par 8 Bots** : Analyse automatique de votre choix
- **Mining Challenge** : Proof of Work simplifié
- **Vote DAO** : Gouvernance décentralisée
- **Système de Points & Badges** : Gamification complète

### 🎯 Mode Solo en Salle ⭐ NOUVEAU
- **Salle partagée** : Hôte + Joueurs avec clé d'accès unique (6 caractères)
- **Progression individuelle** : Chacun joue à son rythme
- **Dashboard temps réel** : Supervision complète par l'hôte
- **Classement dynamique** : Mise à jour toutes les 2 secondes
- **Statistiques détaillées** : En jeu, Terminés, Éliminés
- **Cas d'usage** : Idéal pour enseignants, formateurs, sessions de groupe

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

```bash
# Cloner le dépôt
git clone https://github.com/zakeelm6/Blockchain-Simulation-Game.git
cd Blockchain-Simulation-Game

# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

### Démarrage

```bash
# Terminal 1 - Backend
cd backend
npm start
# Backend: http://localhost:4000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Frontend: http://localhost:5173
```

## 📦 Déploiement avec Docker

```bash
# Mode développement
docker-compose up -d

# Mode production
docker-compose -f docker-compose.prod.yml up -d
```

Accédez à : `http://localhost`

## 🧠 Concepts Blockchain Enseignés

- ✅ **Smart Contracts** : Identification de vulnérabilités (reentrancy, overflow, accès non autorisé)
- ✅ **Proof of Work** : Minage de blocs avec recherche de nonce
- ✅ **Hashing** : Calcul de hash de blocs (algorithme simplifié)
- ✅ **DAO Governance** : Vote décentralisé avec pondération
- ✅ **Consensus** : Validation par multiples nœuds (8 bots)
- ✅ **Blockchain Structure** : Blocs, transactions, previous hash, timestamp

## 🎯 Public Cible

- 🎓 **Étudiants** : Découverte interactive de la blockchain
- 👨‍🏫 **Enseignants** : Outil pédagogique clé en main avec supervision
- 💼 **Entreprises** : Formation technique blockchain
- 🚀 **Développeurs** : Apprentissage ludique des concepts

## 💡 Nouveautés de cette Version

### Mode Solo en Salle
Un nouveau mode multijoueur révolutionnaire :
- Hôte crée une salle avec clé unique
- Joueurs rejoignent et jouent individuellement
- Dashboard temps réel pour supervision
- Classement automatique par score
- Parfait pour les formations en groupe

### Améliorations
- Interface utilisateur modernisée
- Performance optimisée du dashboard
- Documentation complète enrichie
- Support Docker amélioré

## 📚 Documentation Complète

Consultez le [README](https://github.com/zakeelm6/Blockchain-Simulation-Game#readme) pour :
- Déroulement détaillé de chaque mode (4 modes disponibles)
- Architecture technique complète
- Guide de déploiement production
- API et endpoints backend
- Système de points détaillé

## 📊 Statistiques du Projet

- **4 Modes de Jeu** : Solo, Solo en Salle, Classe, DAO Builder
- **100 Smart Contracts** : Base de données éducative
- **8 Validateurs Bots** : Système de consensus automatique
- **Support Multiutilisateur** : Jusqu'à 50+ joueurs simultanés par salle
- **Temps Réel** : Mise à jour automatique toutes les 2 secondes

## 🐛 Bugs Connus

Aucun bug majeur connu à ce jour.

Rapportez les bugs via [Issues](https://github.com/zakeelm6/Blockchain-Simulation-Game/issues).

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

Développé avec ❤️ par [Zakeel M](https://github.com/zakeelm6)

Construit avec :
- ⚛️ React 18
- 🟢 Node.js + Express
- 🐳 Docker
- ⚡ Vite

## 📧 Support

Pour toute question ou support :
- 📝 Ouvrez une [Issue](https://github.com/zakeelm6/Blockchain-Simulation-Game/issues)
- 💬 Démarrez une [Discussion](https://github.com/zakeelm6/Blockchain-Simulation-Game/discussions)
- ⭐ N'oubliez pas de star le projet si vous l'aimez !

---

**🎉 Bonne découverte de la blockchain de manière interactive !**
