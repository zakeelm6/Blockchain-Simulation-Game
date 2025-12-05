# 🚀 GUIDE DE DEMARRAGE RAPIDE - SANS ERREUR

## ⚡ LANCEMENT EN 3 COMMANDES

### Terminal 1 : Backend
```powershell
cd D:\Blockchain-Simulation-Game\backend
npm start
```
✅ Vous devez voir : `Backend listening on http://localhost:4000`

**Laissez ce terminal OUVERT**

---

### Terminal 2 : Frontend
```powershell
cd D:\Blockchain-Simulation-Game\frontend

# Creer le fichier de configuration
echo VITE_API_URL=http://localhost:4000 > .env.local

# Demarrer le frontend
npm run dev
```
✅ Vous devez voir : `Local: http://localhost:5173/`

**Laissez ce terminal OUVERT**

---

### Terminal 3 : Ouvrir le navigateur
```powershell
start http://localhost:5173
```

✅ Le jeu s'ouvre dans votre navigateur !

---

## 🎮 TESTER LE JEU

1. Cliquez sur **"Mode Solo"**
2. Entrez votre nom
3. Choisissez un smart contract
4. Regardez les 8 bots valider
5. Voyez le résultat !

---

## 🐛 EN CAS D'ERREUR "HTTP 404" OU "Unexpected token"

### Solution : Redémarrer proprement

**1. Arrêter tout**
```powershell
# Dans chaque terminal, appuyez sur Ctrl+C
# Ou fermez toutes les fenêtres PowerShell
```

**2. Relancer dans l'ordre**
```powershell
# Terminal 1 : Backend
cd D:\Blockchain-Simulation-Game\backend
npm start

# Attendre 3 secondes

# Terminal 2 : Frontend
cd D:\Blockchain-Simulation-Game\frontend
Remove-Item .env.local -ErrorAction SilentlyContinue
echo VITE_API_URL=http://localhost:4000 > .env.local
npm run dev

# Attendre 3 secondes

# Terminal 3 : Navigateur
start http://localhost:5173
```

---

## 📝 VÉRIFICATIONS

### Backend fonctionne ?
```powershell
curl http://localhost:4000/api/health
```
✅ Doit retourner du JSON

### Frontend fonctionne ?
```powershell
curl http://localhost:5173
```
✅ Doit retourner du HTML

### Configuration correcte ?
```powershell
cat D:\Blockchain-Simulation-Game\frontend\.env.local
```
✅ Doit afficher : `VITE_API_URL=http://localhost:4000`

---

## 🎯 CHECKLIST RAPIDE

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] `.env.local` contient `VITE_API_URL=http://localhost:4000`
- [ ] Navigateur s'ouvre sur `http://localhost:5173`
- [ ] Page d'accueil s'affiche
- [ ] Mode Solo fonctionne
- [ ] Les smart contracts s'affichent

---

## 💡 ASTUCE

Si vous relancez le frontend, **Vite recharge automatiquement**. 
Pas besoin de redémarrer si vous modifiez juste le code React.

**Mais si vous modifiez `.env.local`, il FAUT redémarrer le frontend !**

---

## ✅ TOUT FONCTIONNE ?

**Parfait ! Maintenant vous pouvez :**
1. ✅ Tester toutes les fonctionnalités
2. ✅ Prendre des screenshots
3. ✅ Enregistrer une vidéo
4. ✅ Publier sur LinkedIn !

---

**Bon test ! 🎮**
