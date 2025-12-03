# 🎯 Guide Rapide - 5 Minutes pour Déployer

## ✅ Checklist avant de commencer
- [ ] Compte GitHub (gratuit) : https://github.com/signup
- [ ] Compte Render.com (gratuit) : https://render.com

---

## 📤 Étape 1 : Pousser sur GitHub (2 minutes)

### Option A : Script automatique (RECOMMANDÉ) ⚡

**Windows PowerShell :**
```powershell
.\deploy.ps1
```

**Mac/Linux :**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B : Manuellement

1. **Créer un nouveau dépôt sur GitHub**
   - Allez sur https://github.com/new
   - Nom : `blockchain-simulation-game`
   - Public ✅
   - Cliquez "Create repository"

2. **Pousser le code**
   ```bash
   git init
   git add .
   git commit -m "Deploy to Render"
   git remote add origin https://github.com/VOTRE_USERNAME/blockchain-simulation-game.git
   git push -u origin main
   ```

---

## 🚀 Étape 2 : Déployer sur Render (3 minutes)

1. **Aller sur Render**
   - https://render.com
   - Cliquez "Get Started for Free"
   - Connectez-vous avec GitHub

2. **Créer un Blueprint**
   - Cliquez sur "New +" (en haut à droite)
   - Sélectionnez "Blueprint"

3. **Connecter votre dépôt**
   - Autorisez Render à accéder à GitHub
   - Sélectionnez `blockchain-simulation-game`
   - Cliquez "Connect"

4. **Appliquer le Blueprint**
   - Donnez un nom (ou laissez par défaut)
   - Cliquez "Apply"

5. **Attendre le déploiement** (5-10 minutes)
   - Render va créer 2 services :
     - ✅ `blockchain-game-backend` (API)
     - ✅ `blockchain-game-frontend` (Interface)
   - Vous verrez les logs en temps réel

6. **Obtenir le lien**
   - Une fois "Live" (vert), cliquez sur `blockchain-game-frontend`
   - Copiez l'URL :
     ```
     https://blockchain-game-frontend-xxxx.onrender.com
     ```

---

## 🎓 Étape 3 : Partager aux étudiants

### Créer un lien court (optionnel)

Utilisez https://bit.ly pour créer un lien plus simple :

```
https://blockchain-game-frontend-xxxx.onrender.com
↓
https://bit.ly/blockchain-inpt
```

### Message aux étudiants

```
🎮 Blockchain Simulation Game - Club IBC

Lien du jeu : https://blockchain-game-frontend-xxxx.onrender.com

Instructions :
1. Ouvrez le lien
2. Choisissez "Mode Solo"
3. Entrez votre nom
4. Commencez à jouer !

Note : Le premier chargement peut prendre 30-60 secondes 
(le serveur se réveille). Ensuite, c'est instantané !

Bon jeu ! 🚀
```

---

## 🔄 Mise à jour du jeu

Pour mettre à jour après modification :

```bash
git add .
git commit -m "Amélioration du jeu"
git push
```

Render redéploiera automatiquement en 2-5 minutes.

---

## ⚠️ Important

### Premier accès
- ⏱️ Le service peut prendre 30-60 secondes au premier accès (il "se réveille")
- 💡 Testez le lien 5 minutes avant votre cours !

### Limites gratuites Render
- ✅ 100 GB de bande passante/mois (suffisant pour 50-100 étudiants)
- ✅ 750 heures/mois (largement suffisant)
- ⚠️ Le service s'endort après 15 minutes d'inactivité

---

## 🐛 Problèmes courants

### Le site ne charge pas
1. Attendez 60 secondes (le service se réveille)
2. Rafraîchissez la page (F5)
3. Vérifiez les logs sur Render Dashboard

### Erreur lors du push GitHub
```bash
# Si l'erreur dit "permission denied"
git remote set-url origin https://github.com/VOTRE_USERNAME/blockchain-simulation-game.git
git push -u origin main
```

### Le backend ne répond pas
1. Allez sur Render Dashboard
2. Cliquez sur `blockchain-game-backend`
3. Vérifiez les logs pour voir l'erreur

---

## 📞 Besoin d'aide ?

1. Consultez le guide complet : `DEPLOY_GUIDE.md`
2. Documentation Render : https://render.com/docs
3. Support Render : Très réactif via le chat

---

✅ **C'est tout ! Votre jeu est en ligne !** 🎉
