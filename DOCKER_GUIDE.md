# 🐳 Guide Docker - Blockchain Simulation Game

## 📋 Installation Docker

### Windows

1. **Téléchargez Docker Desktop:**
   - Allez sur: https://www.docker.com/products/docker-desktop/
   - Téléchargez Docker Desktop pour Windows
   - Installez-le (redémarrage requis)

2. **Vérifiez l'installation:**
   ```bash
   docker --version
   docker-compose --version
   ```

### Linux / Mac

```bash
# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Mac
brew install --cask docker
```

---

## 🚀 Lancer l'Application avec Docker

### Option 1: Mode Développement (Recommandé)

```bash
# Depuis le dossier racine du projet
docker-compose up -d
```

**Accès:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

**Arrêter:**
```bash
docker-compose down
```

**Voir les logs:**
```bash
docker-compose logs -f
```

### Option 2: Mode Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Accès:**
- Application: http://localhost (port 80)
- Backend: http://localhost:4000

---

## 🔧 Commandes Utiles

### Rebuilder les images après modifications du code

```bash
docker-compose up -d --build
```

### Voir les conteneurs en cours d'exécution

```bash
docker ps
```

### Arrêter et supprimer tout

```bash
docker-compose down -v
```

### Voir les logs d'un service spécifique

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Accéder au shell d'un conteneur

```bash
docker exec -it bc-game-backend sh
docker exec -it bc-game-frontend sh
```

---

## 📊 Structure Docker

### Services créés:
- **bc-game-backend**: Serveur Node.js sur port 4000
- **bc-game-frontend**: Application React sur port 5173 (dev) ou 80 (prod)
- **blockchain-network**: Réseau bridge pour la communication

### Volumes:
- Code monté en temps réel (mode dev)
- node_modules isolés dans les conteneurs

---

## 🐛 Résolution de Problèmes

### Port déjà utilisé

Si les ports 4000 ou 5173 sont occupés:

**Modifier `docker-compose.yml`:**
```yaml
ports:
  - "4001:4000"  # Backend sur 4001 au lieu de 4000
  - "3000:5173"  # Frontend sur 3000 au lieu de 5173
```

### Les modifications ne sont pas prises en compte

```bash
# Rebuild complet
docker-compose down
docker-compose up -d --build
```

### Problème de permissions (Linux)

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Conteneurs qui crashent

```bash
# Voir les logs pour identifier le problème
docker-compose logs backend
docker-compose logs frontend
```

---

## ✅ Vérification que tout fonctionne

1. **Démarrez les conteneurs:**
   ```bash
   docker-compose up -d
   ```

2. **Vérifiez qu'ils tournent:**
   ```bash
   docker ps
   ```
   Vous devriez voir 2 conteneurs: `bc-game-backend` et `bc-game-frontend`

3. **Testez l'accès:**
   - Ouvrez http://localhost:5173 dans votre navigateur
   - Vous devriez voir la page d'accueil du jeu

4. **Testez le backend:**
   ```bash
   curl http://localhost:4000/api/solo/contracts/pair
   ```
   Devrait retourner des smart contracts en JSON

---

## 🎯 Workflow de Développement

1. **Démarrer:**
   ```bash
   docker-compose up -d
   ```

2. **Coder:**
   - Modifiez le code dans `backend/` ou `frontend/`
   - Les changements sont automatiquement détectés (hot reload)

3. **Voir les logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Arrêter quand vous avez fini:**
   ```bash
   docker-compose down
   ```

---

## 📦 Alternative: Exécution Sans Docker

Si Docker pose problème, vous pouvez exécuter manuellement:

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

**Accès:** http://localhost:5173

---

**Besoin d'aide?** Consultez le README.md pour plus d'informations.
