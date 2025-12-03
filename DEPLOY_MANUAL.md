# 🚀 Guide de Déploiement Manuel (ALTERNATIVE - RECOMMANDÉ)

## ⚠️ Problème avec le Blueprint

Le fichier `render.yaml` (Blueprint) a des limitations avec les sites statiques.
**Solution : Déployer manuellement les deux services séparément.**

---

## 📋 ÉTAPE 1 : Déployer le Backend

### 1.1 Créer le service Backend
1. Allez sur https://render.com/dashboard
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre dépôt GitHub : `Blockchain-Simulation-Game`
4. Cliquez **"Connect"**

### 1.2 Configurer le Backend
Remplissez les champs suivants :

| Champ | Valeur |
|-------|--------|
| **Name** | `blockchain-game-backend` |
| **Region** | Frankfurt (EU Central) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### 1.3 Variables d'environnement
Ajoutez ces variables :
- `NODE_ENV` = `production`
- `PORT` = `4000`

### 1.4 Déployer
1. Cliquez **"Create Web Service"**
2. Attendez 5 minutes que le déploiement se termine
3. **IMPORTANT** : Copiez l'URL du backend :
   ```
   https://blockchain-game-backend-xxxx.onrender.com
   ```

---

## 📋 ÉTAPE 2 : Déployer le Frontend

### 2.1 Créer le service Frontend
1. Retournez sur https://render.com/dashboard
2. Cliquez sur **"New +"** → **"Static Site"**
3. Sélectionnez le même dépôt : `Blockchain-Simulation-Game`
4. Cliquez **"Connect"**

### 2.2 Configurer le Frontend

| Champ | Valeur |
|-------|--------|
| **Name** | `blockchain-game-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 2.3 Variable d'environnement CRUCIALE
Ajoutez cette variable (utilisez l'URL du backend de l'étape 1.4) :

```
VITE_API_URL = https://blockchain-game-backend-xxxx.onrender.com
```

⚠️ **IMPORTANT** : Remplacez `xxxx` par l'URL exacte de votre backend !

### 2.4 Déployer
1. Cliquez **"Create Static Site"**
2. Attendez 3-5 minutes
3. Une fois "Live", copiez l'URL :
   ```
   https://blockchain-game-frontend-yyyy.onrender.com
   ```

---

## 📋 ÉTAPE 3 : Tester

1. Ouvrez l'URL du frontend dans votre navigateur
2. Vous devriez voir la page d'accueil du jeu
3. Testez le mode Solo pour vérifier que tout fonctionne

---

## 🐛 Si vous voyez "Cannot GET /"

Cela signifie probablement que :
1. Le build ne s'est pas fait correctement
2. Le `Publish Directory` n'est pas correct

**Solution** :
1. Allez dans les settings du frontend sur Render
2. Vérifiez que `Publish Directory` = `dist`
3. Cliquez sur "Manual Deploy" → "Clear build cache & deploy"

---

## 🐛 Si les appels API ne fonctionnent pas

Vérifiez que :
1. La variable `VITE_API_URL` contient la bonne URL du backend
2. Le backend est bien "Live" (vert) sur Render
3. L'URL du backend se termine par `.onrender.com` sans `/api`

**Pour vérifier** :
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs réseau
3. Vérifiez quelle URL est appelée

---

## ✅ Une fois que ça fonctionne

### URL à partager aux étudiants :
```
https://blockchain-game-frontend-yyyy.onrender.com
```

### Message type :
```
🎮 Blockchain Simulation Game - Club IBC

Lien : https://blockchain-game-frontend-yyyy.onrender.com

1. Ouvrez le lien
2. Choisissez "Mode Solo"
3. Entrez votre nom
4. Jouez !

⏱️ Premier chargement : 30-60 secondes
```

---

## 🔄 Mises à jour futures

Quand vous modifiez le code :
```bash
git add .
git commit -m "Amélioration"
git push
```

Render redéploiera automatiquement les deux services.

---

## 💡 Pourquoi cette méthode ?

- ✅ Plus simple que le Blueprint
- ✅ Plus de contrôle sur chaque service
- ✅ Évite les problèmes de variables d'environnement
- ✅ Plus facile à débugger

---

**Bonne chance ! 🚀**
