<<<<<<< HEAD
# Blockchain-Simulation-Game
=======
# Blockchain Activity

Application web interactive pour simuler deux activités autour de la blockchain: validation de smart contracts (Activité 1), phase de minting chronométrée, puis gouvernance type DAO avec votes pondérés (Activité 2).

## Structure du projet
- `blockchain.html` — Interface principale (toutes les vues) et styles.
- `storage.js` — Constantes LocalStorage et helpers (chargement/sauvegarde, journal des votes, échappement HTML).
- `activity1.js` — Logique Activité 1 (équipes, compteurs, total, éligibilité >= 2 validateurs).
- `activity2.js` — Logique Activité 2 (tableau des scores, votes pondérés, journal, suppression d’entrées, calcul final + bonus/malus).
- `main.js` — Routage des vues, initialisation, page Équipes (sélection crypto), page Minting (timer 4 min, attribution des bonus), événements.
- `assets/` — Logos (club, cryptos `1.jpg` … `8.jpg`).

## Lancer l’application
1. Ouvrir le fichier `blockchain.html` dans un navigateur récent (Chrome, Edge, Firefox).
2. Aucune dépendance serveur; tout est en JavaScript côté client avec `localStorage`.

## Flux utilisateur
1. Accueil / Intro.
2. Équipes: choisir une crypto (images `assets/1.jpg..8.jpg`), donner un nom d’équipe. Sauvegarde pour l’Activité 1.
3. Activité 1: saisir les compteurs par équipe.
   - Bon choix (+3)
   - Validation réussie (+2)
   - Validation erronée (−2)
   - Validateurs (éligible si ≥ 2)
4. Minting (4 min): sélectionner le statut par équipe éligible.
   - 1er (+10), 2ème (+5), autres réussis (+1), échec (0)
   - Appliquer les points → transfert vers Activité 2.
5. Activité 2: votes pondérés par les points (tokens) accumulés.
   - Pour = +3×tokens, Contre = −1×tokens
   - Journal des votes (suppression par entrée possible, "Tout supprimer" rétablit les scores)
   - Terminer les votes → Résultats finales
6. Résultats finales: +5 à l’équipe la plus soutenue, −5 à la plus rejetée.

## Raccourcis de navigation
- Barre supérieure: Accueil, Intro, Équipes, Activité 1, Minting, Activité 2, Tableau des scores, Résultats finales.

## Persistance des données (LocalStorage)
- Équipes Activité 1: `bc_activity1_teams_v1`
- Équipes Activité 2 / Scoreboard: `bc_challenge_teams_v1`
- Journal des votes (Activité 2): `bc_activity2_votes_log_v1`

## Notes d’implémentation
- Suppression “Bloc complété” et “Mauvaise validation” en Activité 1.
- Page Équipes avant Activité 1 pour associer un logo crypto (jpg) et un nom d’équipe.
- Page Minting entre Activité 1 et 2 avec minuteur 4 min et attribution de bonus (10/5/1/0).
- UI en français, thème clair, survol violet, mise en page full width.

## Déploiement
- Dépôt GitHub: push tel quel; `blockchain.html` est la page d’entrée.
- GitHub Pages / Netlify: définir `blockchain.html` comme page d’accueil (ou renommer en `index.html`).

## Licence
Indiquez ici la licence de votre choix (par ex. MIT).
>>>>>>> da472c8 (Ajout de tous les fichiers locaux)
