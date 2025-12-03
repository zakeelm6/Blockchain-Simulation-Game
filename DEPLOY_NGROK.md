# 🚀 Déploiement RAPIDE avec ngrok (2 minutes)

## 📦 ÉTAPE 1 : Installer ngrok (1 minute)

### Windows

**Option A : Téléchargement direct**
1. Allez sur https://ngrok.com/download
2. Téléchargez la version Windows (ZIP)
3. Extrayez `ngrok.exe` dans `C:\ngrok\` ou votre dossier de projet
4. Ajoutez au PATH (optionnel) ou utilisez le chemin complet

**Option B : Avec Chocolatey**
```powershell
choco install ngrok
```

**Option C : Avec Scoop**
```powershell
scoop install ngrok
```

### Créer un compte ngrok (GRATUIT)
1. Allez sur https://dashboard.ngrok.com/signup
2. Créez un compte gratuit
3. Copiez votre **authtoken** depuis https://dashboard.ngrok.com/get-started/your-authtoken

### Configurer l'authtoken
```powershell
ngrok config add-authtoken VOTRE_TOKEN_ICI
```

---

## 🚀 ÉTAPE 2 : Lancer le Backend (30 secondes)

### Terminal 1 : Backend
```powershell
cd D:\Blockchain-Simulation-Game\backend
npm install
npm start
```

Vous devriez voir :
```
Backend listening on http://localhost:4000
```

### Terminal 2 : Exposer le backend avec ngrok
```powershell
ngrok http 4000
```

Vous verrez quelque chose comme :
```
Forwarding   https://abc123.ngrok.app -> http://localhost:4000
```

**⚠️ IMPORTANT : Copiez cette URL ngrok du backend !**
```
https://abc123.ngrok.app
```

---

## 🌐 ÉTAPE 3 : Lancer le Frontend (30 secondes)

### Terminal 3 : Configurer le frontend
Créez/modifiez le fichier `.env.local` dans le dossier `frontend` :

```bash
cd D:\Blockchain-Simulation-Game\frontend
echo VITE_API_URL=https://abc123.ngrok.app > .env.local
```

**⚠️ Remplacez `abc123.ngrok.app` par votre vraie URL ngrok du backend !**

### Lancer le frontend
```powershell
npm install
npm run dev
```

Le frontend sera sur :
```
http://localhost:5173
```

### Terminal 4 : Exposer le frontend avec ngrok
```powershell
ngrok http 5173
```

Vous verrez :
```
Forwarding   https://xyz789.ngrok.app -> http://localhost:5173
```

**🎉 C'EST CE LIEN QUE VOUS PARTAGEZ AUX ÉTUDIANTS !**
```
https://xyz789.ngrok.app
```

---

## 📧 Message pour les étudiants

```
🎮 Blockchain Simulation Game - Club IBC

Lien : https://xyz789.ngrok.app

Instructions :
1. Ouvrez le lien
2. Choisissez "Mode Solo"
3. Entrez votre nom
4. Commencez à jouer !

Bon jeu ! 🚀
```

---

## 🎯 Résumé rapide (4 terminaux)

```
Terminal 1 : cd backend && npm start
Terminal 2 : ngrok http 4000  (copier l'URL)
Terminal 3 : cd frontend && VITE_API_URL=https://abc123.ngrok.app npm run dev
Terminal 4 : ngrok http 5173  (partager cette URL)
```

---

## ⚠️ Limitations ngrok gratuit

- ✅ **GRATUIT** et instantané
- ✅ Parfait pour des tests courts
- ⚠️ L'URL change à chaque redémarrage
- ⚠️ Limite : 40 connexions/minute
- ⚠️ Sessions de 2 heures max (puis reconnexion)
- ⚠️ Votre PC doit rester allumé

---

## 💡 Conseils

### Garder les liens stables
Avec un compte ngrok gratuit, vous pouvez utiliser des domaines réservés :
```powershell
ngrok http 4000 --domain=mon-backend-fixe.ngrok-free.app
ngrok http 5173 --domain=mon-frontend-fixe.ngrok-free.app
```

### Utiliser un fichier de config ngrok
Créez `ngrok.yml` :
```yaml
version: 2
authtoken: VOTRE_TOKEN
tunnels:
  backend:
    proto: http
    addr: 4000
  frontend:
    proto: http
    addr: 5173
```

Puis lancez :
```powershell
ngrok start --all
```

---

## 🔄 Pour fermer

Appuyez sur `Ctrl+C` dans chaque terminal pour arrêter.

---

## 🆚 ngrok vs Render

| Critère | ngrok | Render |
|---------|-------|--------|
| **Setup** | 2 minutes | 15 minutes |
| **Prix** | Gratuit | Gratuit |
| **Lien** | Change à chaque fois | Permanent |
| **Session** | 2h max | Illimité |
| **PC** | Doit rester allumé | Non |
| **Idéal pour** | Tests rapides | Production |

---

## ✅ Vous êtes prêt !

1. Installez ngrok
2. Lancez les 4 commandes
3. Partagez le lien frontend !

**C'est parti ! 🚀**
