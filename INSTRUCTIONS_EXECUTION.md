# ✅ VOTRE APPLICATION EST EN COURS D'EXÉCUTION!

## 🌐 Accès à l'Application

### 🎮 Frontend (Interface Utilisateur)
**URL:** http://localhost:5174

**Ce que vous pouvez faire:**
- Cliquez sur "🎮 Mode Solo" pour jouer seul
- Cliquez sur "🎯 Solo en Salle" pour créer/rejoindre une salle multijoueur
- Cliquez sur "🎓 Mode Classe" pour mode classe (Équipe ou Solo)
- Cliquez sur "🏛️ DAO Builder" pour créer un DAO

### ⚙️ Backend (API)
**URL:** http://localhost:4000

**Test de l'API:**
```bash
curl http://localhost:4000/api/solo/contracts/pair
```

---

## 🎯 Les 4 Modes de Jeu

### 1. Mode Solo
1. Entrez votre nom
2. Choisissez entre 2 smart contracts (1 bon, 1 mauvais)
3. 8 bots valident votre choix
4. Challenge de mining (trouvez le nonce)
5. Vote DAO
6. Résultats avec score et badges

### 2. Mode Solo en Salle ⭐ NOUVEAU
**Hôte:**
1. Cliquez "Créer une Salle"
2. Entrez nom de salle et votre nom
3. Partagez la clé (6 caractères) avec les joueurs
4. Surveillez le dashboard en temps réel

**Joueurs:**
1. Cliquez "Rejoindre une Salle"
2. Entrez la clé et votre nom
3. Jouez individuellement
4. Votre progression apparaît sur le dashboard de l'hôte

### 3. Mode Classe
**Variante Équipe:**
- Groupes de 4 (3 votants + 1 validateur)
- Vote collectif pour choisir smart contract
- Validation croisée
- Mining collaboratif

**Variante Solo en Classe:**
- Responsable crée une classe
- Chaque étudiant joue individuellement
- Dashboard de suivi temps réel
- Vote DAO final entre ceux qui terminent

### 4. Mode DAO Builder
1. Créez un DAO avec paramètres de gouvernance
2. Distribuez des tokens aux membres
3. Créez des propositions (financement, paramètres, général)
4. Les membres votent avec poids selon leurs tokens
5. Exécution automatique si approuvé

---

## 🛑 Arrêter l'Application

### Arrêter les serveurs
Fermez les terminaux ou appuyez sur `Ctrl+C` dans chaque terminal

### Ou tuez les processus
```bash
# Trouver les processus
netstat -ano | findstr :4000
netstat -ano | findstr :5174

# Tuer les processus (remplacez PID par le numéro)
taskkill //F //PID <PID>
```

---

## 🔄 Redémarrer l'Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Accès:** http://localhost:5174 (ou 5173 si disponible)

---

## 🐳 Avec Docker (Alternative - Nécessite Installation)

### Installation Docker
1. Téléchargez Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Installez et redémarrez votre PC
3. Démarrez Docker Desktop

### Lancement
```bash
# Depuis le dossier racine
docker-compose up -d
```

**Accès:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Arrêt
```bash
docker-compose down
```

### Voir les logs
```bash
docker-compose logs -f
```

---

## 📊 Structure des Fichiers

```
Blockchain-Simulation-Game/
│
├── backend/              Backend Node.js (Port 4000)
│   ├── server.js        API principale avec 22+ endpoints
│   ├── smartContracts.js  Base de 100 smart contracts
│   └── package.json
│
├── frontend/            Frontend React (Port 5174)
│   ├── src/
│   │   ├── App.jsx      Router principal
│   │   ├── LandingPage.jsx  Page d'accueil
│   │   ├── Mode Solo (4 fichiers)
│   │   ├── Mode Solo Room (5 fichiers)
│   │   ├── Mode Classe (10 fichiers)
│   │   └── Mode DAO (5 fichiers)
│   └── package.json
│
├── docker-compose.yml   Configuration Docker dev
├── README.md           Documentation principale
└── DOCKER_GUIDE.md     Guide Docker complet
```

---

## 🧪 Tester les Fonctionnalités

### Test Mode Solo
1. Allez sur http://localhost:5174
2. Cliquez "🎮 Mode Solo"
3. Entrez votre nom
4. Suivez le parcours complet

### Test Mode Solo en Salle
**Ouvrez 2 navigateurs:**

**Navigateur 1 (Hôte):**
1. Cliquez "🎯 Solo en Salle" → "Créer une Salle"
2. Entrez nom et créez
3. Notez la clé (ex: ABC123)

**Navigateur 2 (Joueur):**
1. Cliquez "🎯 Solo en Salle" → "Rejoindre une Salle"
2. Entrez la clé et votre nom
3. Commencez à jouer
4. Retournez au navigateur 1 pour voir le joueur apparaître!

### Test API Backend
```bash
# Test récupération de smart contracts
curl http://localhost:4000/api/solo/contracts/pair

# Test état du serveur
curl http://localhost:4000/
```

---

## 🐛 Problèmes Courants

### Port déjà utilisé
Si les ports 4000 ou 5173/5174 sont occupés:
```bash
# Trouver le processus
netstat -ano | findstr :4000

# Tuer le processus
taskkill //F //PID <numéro>
```

### Module non trouvé
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Erreur de connexion
Vérifiez que le backend tourne sur http://localhost:4000

---

## 📚 Documentation Complète

Tout est dans **README.md** pour:
- Détails de chaque mode
- Architecture technique
- Guide de déploiement
- Concepts blockchain enseignés

---

## ✅ Checklist de Vérification

- [ ] Backend tourne sur port 4000
- [ ] Frontend tourne sur port 5174
- [ ] Page d'accueil accessible (http://localhost:5174)
- [ ] 4 boutons de modes visibles
- [ ] Mode Solo fonctionne
- [ ] Mode Solo en Salle fonctionne
- [ ] Mode Classe fonctionne
- [ ] Mode DAO Builder fonctionne

---

**🎉 Félicitations! Votre application Blockchain Simulation Game est opérationnelle!**

**Support:** Consultez README.md ou DOCKER_GUIDE.md
