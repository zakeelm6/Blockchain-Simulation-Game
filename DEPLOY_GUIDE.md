# Blockchain Simulation Game - Guide de déploiement Render.com

## 🚀 Déploiement sur Render.com (GRATUIT)

### Prérequis
- Avoir un compte GitHub (gratuit)
- Avoir un compte Render.com (gratuit, pas besoin de carte bancaire)

---

## 📋 Étape 1 : Pousser le code sur GitHub

### 1.1 Créer un nouveau dépôt sur GitHub
1. Allez sur https://github.com/new
2. Nom du dépôt : `blockchain-simulation-game`
3. Choisissez **Public** ou **Private**
4. **NE PAS** initialiser avec README, .gitignore ou licence
5. Cliquez sur **Create repository**

### 1.2 Pousser votre code
Ouvrez un terminal dans le dossier `D:\Blockchain-Simulation-Game` et exécutez :

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer un commit
git commit -m "Initial commit - Blockchain Simulation Game"

# Ajouter l'origine GitHub (remplacez VOTRE_USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/VOTRE_USERNAME/blockchain-simulation-game.git

# Pousser sur GitHub
git push -u origin main
```

**Si vous avez déjà un dépôt git, faites simplement :**
```bash
git add .
git commit -m "Add Render configuration"
git push
```

---

## 📋 Étape 2 : Créer un compte Render.com

1. Allez sur https://render.com
2. Cliquez sur **Get Started for Free**
3. Inscrivez-vous avec votre compte GitHub (recommandé) ou email
4. Confirmez votre email

---

## 📋 Étape 3 : Déployer sur Render

### 3.1 Connecter votre dépôt GitHub
1. Sur Render Dashboard, cliquez sur **New +** → **Blueprint**
2. Cliquez sur **Connect GitHub**
3. Autorisez Render à accéder à vos dépôts
4. Sélectionnez le dépôt `blockchain-simulation-game`
5. Cliquez sur **Connect**

### 3.2 Configuration automatique via render.yaml
Render va détecter automatiquement le fichier `render.yaml` et configurer :
- ✅ Backend (Node.js API sur port 4000)
- ✅ Frontend (React static site)
- ✅ Variables d'environnement
- ✅ Connexion automatique entre frontend et backend

### 3.3 Lancer le déploiement
1. Donnez un nom à votre Blueprint (ou laissez par défaut)
2. Cliquez sur **Apply**
3. Render va créer deux services :
   - `blockchain-game-backend`
   - `blockchain-game-frontend`

---

## ⏱️ Étape 4 : Attendre le déploiement (5-10 minutes)

Render va :
1. ✅ Cloner votre code
2. ✅ Installer les dépendances (npm install)
3. ✅ Builder le frontend (npm run build)
4. ✅ Démarrer le backend
5. ✅ Générer les URLs publiques

**Vous verrez les logs en temps réel dans l'interface Render.**

---

## 🎉 Étape 5 : Obtenir le lien public

Une fois le déploiement terminé (statut **Live** en vert) :

1. Cliquez sur le service **blockchain-game-frontend**
2. En haut, vous verrez l'URL publique :
   ```
   https://blockchain-game-frontend-xxxx.onrender.com
   ```
3. **C'EST CE LIEN QUE VOUS PARTAGEZ AUX ÉTUDIANTS !** 🎓

---

## 📱 Partager avec les étudiants

### Créer un lien court (optionnel)
Utilisez un service comme :
- bit.ly : https://bitly.com
- tinyurl : https://tinyurl.com

Exemple :
```
https://blockchain-game-frontend-xxxx.onrender.com
→
https://bit.ly/blockchain-game-inpt
```

---

## 🔧 Mise à jour du jeu

Pour mettre à jour le jeu après modification du code :

```bash
# Commitez vos changements
git add .
git commit -m "Amélioration du jeu"
git push

# Render va automatiquement redéployer (2-5 minutes)
```

---

## ⚠️ Limitations du plan gratuit Render

- ✅ Bande passante : 100 GB/mois (largement suffisant pour 50-100 étudiants)
- ✅ Le service s'endort après 15 minutes d'inactivité
  - Premier accès = 30-50 secondes de chargement
  - Ensuite = instantané
- ✅ 750 heures gratuites par mois (suffisant)

**Astuce :** Testez le lien 5 minutes avant le cours pour le "réveiller" !

---

## 🐛 Dépannage

### Problème : Le backend ne répond pas
1. Vérifiez les logs du service backend sur Render
2. Assurez-vous que le port 4000 est bien configuré

### Problème : Erreur CORS
Le backend est déjà configuré avec `cors()` donc cela ne devrait pas arriver.

### Problème : Le frontend ne trouve pas le backend
Vérifiez que la variable d'environnement `VITE_API_URL` est bien configurée dans le service frontend.

---

## 📞 Support

Si vous avez des problèmes :
1. Vérifiez les logs sur Render Dashboard
2. Consultez la documentation : https://render.com/docs
3. Contactez le support Render (très réactif)

---

## ✅ Checklist finale

- [ ] Code poussé sur GitHub
- [ ] Compte Render.com créé
- [ ] Blueprint connecté au dépôt GitHub
- [ ] Les deux services sont **Live** (vert)
- [ ] Le lien frontend fonctionne
- [ ] Testé le mode solo
- [ ] Partagé le lien aux étudiants

---

Bonne chance avec votre cours ! 🎓🚀
