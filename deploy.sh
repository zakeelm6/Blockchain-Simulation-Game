#!/bin/bash

echo "🚀 Déploiement du Blockchain Simulation Game sur Render.com"
echo "============================================================"
echo ""

# Vérifier si git est initialisé
if [ ! -d .git ]; then
    echo "📦 Initialisation du dépôt Git..."
    git init
fi

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers au commit..."
git add .

# Demander le message de commit
echo ""
read -p "💬 Message de commit (défaut: 'Deploy to Render'): " commit_msg
commit_msg=${commit_msg:-"Deploy to Render"}

# Créer le commit
echo "✅ Création du commit..."
git commit -m "$commit_msg"

# Demander l'URL du dépôt GitHub
echo ""
echo "📋 Configuration du dépôt GitHub"
echo "Créez d'abord un nouveau dépôt sur https://github.com/new"
echo ""
read -p "🔗 URL de votre dépôt GitHub (ex: https://github.com/username/blockchain-game.git): " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ URL du dépôt requise !"
    exit 1
fi

# Vérifier si l'origine existe déjà
if git remote | grep -q "^origin$"; then
    echo "🔄 Mise à jour de l'origine..."
    git remote set-url origin "$repo_url"
else
    echo "🔗 Ajout de l'origine..."
    git remote add origin "$repo_url"
fi

# Pousser sur GitHub
echo "⬆️  Envoi vers GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Code poussé sur GitHub avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Allez sur https://render.com"
echo "2. Créez un compte (gratuit)"
echo "3. Cliquez sur 'New +' → 'Blueprint'"
echo "4. Connectez votre dépôt GitHub"
echo "5. Render déploiera automatiquement votre app !"
echo ""
echo "📖 Guide complet : DEPLOY_GUIDE.md"
echo ""
