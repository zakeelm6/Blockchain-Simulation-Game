# ✅ CHECKLIST DE TEST COMPLÈTE

## 🧪 TESTS LOCAUX (AVANT NGROK)

### Backend (http://localhost:4000)
- [ ] Le serveur démarre sans erreur
- [ ] L'endpoint /api/health répond
- [ ] Les routes API fonctionnent :
  - [ ] GET /api/health
  - [ ] GET /api/solo/contracts/pair
  - [ ] POST /api/solo/contracts/answer
  - [ ] GET /api/teams
  - [ ] POST /api/votes/submit

### Frontend (http://localhost:5173)
- [ ] L'application se charge sans erreur console
- [ ] La page d'accueil s'affiche correctement
- [ ] Les styles CSS sont appliqués
- [ ] Les images se chargent
- [ ] Navigation entre les sections fonctionne

---

## 🎮 TESTS FONCTIONNELS - MODE SOLO

### Page d'accueil
- [ ] Le titre "Blockchain Simulation Game" s'affiche
- [ ] Le bouton "Mode Solo" est visible
- [ ] Le logo IBC s'affiche
- [ ] Les descriptions sont lisibles

### Saisie du nom
- [ ] Le champ de texte fonctionne
- [ ] On peut saisir un nom
- [ ] Le bouton "Continuer" est actif après saisie
- [ ] Le bouton est désactivé si le champ est vide

### Choix du Smart Contract
- [ ] 2 smart contracts s'affichent
- [ ] Les titres sont lisibles
- [ ] Les descriptions sont claires
- [ ] Le code est affiché
- [ ] On peut cliquer sur "Choisir ce contrat"

### Validation par les bots
- [ ] Les 8 bots s'affichent
- [ ] Chaque bot a un nom distinct
- [ ] Les bots "réfléchissent" (animation/délai)
- [ ] Les bots votent progressivement
- [ ] Les votes (✅/❌) s'affichent
- [ ] Le compte des validations est correct

### Résultat de la validation
- [ ] Le message de succès/échec s'affiche
- [ ] Le nombre de validateurs est affiché
- [ ] L'explication du résultat est claire
- [ ] Le bouton "Continuer" apparaît si ≥2 validations

---

## 🎮 TESTS FONCTIONNELS - MODE CLASSE

### Création d'équipe
- [ ] On peut choisir une cryptomonnaie
- [ ] On peut entrer un nom d'équipe
- [ ] Le bouton "Ajouter" fonctionne
- [ ] L'équipe apparaît dans la liste
- [ ] On peut créer jusqu'à 8 équipes

### Activité 1
- [ ] Les compteurs fonctionnent (+/-)
- [ ] Les points se calculent correctement
- [ ] Le statut d'éligibilité se met à jour
- [ ] On peut passer au minting

### Phase de Minting
- [ ] Le timer de 4 minutes fonctionne
- [ ] On peut démarrer/arrêter le timer
- [ ] On peut sélectionner le statut par équipe
- [ ] Les bonus sont attribués correctement

### Activité 2 - Votes
- [ ] Le tableau des scores s'affiche
- [ ] On peut voter Pour/Contre
- [ ] Les points sont pondérés correctement
- [ ] Le journal des votes se met à jour

---

## 🌐 TESTS AVEC NGROK

### Configuration
- [ ] ngrok.exe est présent
- [ ] L'authtoken est configuré
- [ ] Le backend tunnel fonctionne
- [ ] L'URL backend est accessible

### Test du frontend avec ngrok
- [ ] Le frontend se connecte au backend ngrok
- [ ] Les appels API fonctionnent
- [ ] Pas d'erreurs CORS
- [ ] Le jeu fonctionne de bout en bout

### Test multi-utilisateurs (si possible)
- [ ] Plusieurs personnes peuvent accéder au lien
- [ ] Pas de conflits entre les sessions
- [ ] Les données sont isolées par joueur

---

## 🐛 TESTS D'ERREURS

### Erreurs réseau
- [ ] Message clair si le backend est inaccessible
- [ ] Retry automatique ou manuel disponible
- [ ] Pas de crash de l'application

### Erreurs de saisie
- [ ] Validation des champs obligatoires
- [ ] Messages d'erreur clairs
- [ ] Impossible de soumettre des données invalides

### Cas limites
- [ ] Nom d'équipe vide
- [ ] Nom trop long
- [ ] Caractères spéciaux
- [ ] Double-clic sur les boutons

---

## 📱 TESTS RESPONSIVE

### Desktop (1920x1080)
- [ ] Mise en page correcte
- [ ] Tous les éléments visibles
- [ ] Pas de débordement horizontal

### Tablette (768x1024)
- [ ] Adaptation de la mise en page
- [ ] Boutons cliquables
- [ ] Texte lisible

### Mobile (375x667)
- [ ] Scroll vertical fonctionne
- [ ] Boutons suffisamment grands
- [ ] Texte lisible sans zoom

---

## 🚀 TESTS DE PERFORMANCE

### Temps de chargement
- [ ] Page d'accueil : < 3 secondes
- [ ] Changement de vue : < 1 seconde
- [ ] Appels API : < 2 secondes

### Utilisation mémoire
- [ ] Pas de fuite mémoire après 10 minutes
- [ ] Frontend reste réactif
- [ ] Backend répond rapidement

---

## 🔒 TESTS DE SÉCURITÉ

### Validation côté serveur
- [ ] Les données sont validées côté backend
- [ ] Pas d'injection possible
- [ ] Les tokens sont vérifiés

### CORS
- [ ] Les requêtes cross-origin fonctionnent
- [ ] Pas d'erreurs CORS dans la console

---

## 📸 CAPTURES D'ÉCRAN POUR LINKEDIN

- [ ] Page d'accueil (belle vue d'ensemble)
- [ ] Mode Solo - Choix du contrat
- [ ] Validation par les bots en action
- [ ] Tableau des scores
- [ ] Logo du Club IBC

---

## 📹 VIDÉO DEMO (OPTIONNEL)

- [ ] Parcours complet du Mode Solo (60 secondes)
- [ ] Qualité vidéo : au moins 720p
- [ ] Pas d'éléments personnels visibles
- [ ] Texte/voix-off explicatif clair

---

## ✅ TESTS FINAUX AVANT PUBLICATION

### GitHub
- [ ] README.md à jour
- [ ] LICENSE présent
- [ ] .gitignore correct
- [ ] Pas de fichiers sensibles (.env, tokens)
- [ ] Branches nettoyées

### Documentation
- [ ] Instructions d'installation claires
- [ ] Guide d'utilisation complet
- [ ] Captures d'écran dans le README

### Déploiement
- [ ] ngrok fonctionne (test local)
- [ ] OU Render fonctionne (prod)
- [ ] Lien stable pour la demo

---

## 🎯 RÉSULTATS DES TESTS

### ✅ Fonctionnalités testées : ___/30
### ✅ Bugs trouvés : ___
### ✅ Bugs corrigés : ___
### ✅ Prêt pour publication : OUI / NON

---

## 📝 NOTES ET OBSERVATIONS

```
[Espace pour noter les bugs, suggestions, améliorations]






```

---

**Date du test : __________**
**Testé par : __________**
**Version : __________**
