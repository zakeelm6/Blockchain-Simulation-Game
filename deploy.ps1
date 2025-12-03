Write-Host "🚀 Déploiement du Blockchain Simulation Game sur Render.com" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

# Vérifier si git est initialisé
if (-not (Test-Path .git)) {
    Write-Host "📦 Initialisation du dépôt Git..." -ForegroundColor Yellow
    git init
}

# Ajouter tous les fichiers
Write-Host "📝 Ajout des fichiers au commit..." -ForegroundColor Yellow
git add .

# Demander le message de commit
Write-Host ""
$commit_msg = Read-Host "💬 Message de commit (défaut: 'Deploy to Render')"
if ([string]::IsNullOrWhiteSpace($commit_msg)) {
    $commit_msg = "Deploy to Render"
}

# Créer le commit
Write-Host "✅ Création du commit..." -ForegroundColor Yellow
git commit -m "$commit_msg"

# Demander l'URL du dépôt GitHub
Write-Host ""
Write-Host "📋 Configuration du dépôt GitHub" -ForegroundColor Cyan
Write-Host "Créez d'abord un nouveau dépôt sur https://github.com/new" -ForegroundColor Cyan
Write-Host ""
$repo_url = Read-Host "🔗 URL de votre dépôt GitHub (ex: https://github.com/username/blockchain-game.git)"

if ([string]::IsNullOrWhiteSpace($repo_url)) {
    Write-Host "❌ URL du dépôt requise !" -ForegroundColor Red
    exit 1
}

# Vérifier si l'origine existe déjà
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "🔄 Mise à jour de l'origine..." -ForegroundColor Yellow
    git remote set-url origin "$repo_url"
} else {
    Write-Host "🔗 Ajout de l'origine..." -ForegroundColor Yellow
    git remote add origin "$repo_url"
}

# Pousser sur GitHub
Write-Host "⬆️  Envoi vers GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "✅ Code poussé sur GitHub avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Allez sur https://render.com"
Write-Host "2. Créez un compte (gratuit)"
Write-Host "3. Cliquez sur 'New +' → 'Blueprint'"
Write-Host "4. Connectez votre dépôt GitHub"
Write-Host "5. Render déploiera automatiquement votre app !"
Write-Host ""
Write-Host "📖 Guide complet : DEPLOY_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
