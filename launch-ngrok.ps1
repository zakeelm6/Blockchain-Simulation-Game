# Script de lancement automatique avec ngrok
Write-Host "🚀 Blockchain Game - Lancement avec ngrok" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Vérifier si ngrok est installé
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue

if (-not $ngrokInstalled) {
    Write-Host "❌ ngrok n'est pas installé !" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Installation de ngrok..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 : Téléchargement manuel" -ForegroundColor Cyan
    Write-Host "  1. Allez sur https://ngrok.com/download"
    Write-Host "  2. Téléchargez ngrok pour Windows"
    Write-Host "  3. Extrayez ngrok.exe dans C:\ngrok\ ou ce dossier"
    Write-Host ""
    Write-Host "Option 2 : Avec Chocolatey" -ForegroundColor Cyan
    Write-Host "  choco install ngrok" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3 : Avec Scoop" -ForegroundColor Cyan
    Write-Host "  scoop install ngrok" -ForegroundColor White
    Write-Host ""
    Write-Host "Puis configurez votre authtoken :" -ForegroundColor Yellow
    Write-Host "  1. Créez un compte sur https://dashboard.ngrok.com/signup"
    Write-Host "  2. Copiez votre token depuis https://dashboard.ngrok.com/get-started/your-authtoken"
    Write-Host "  3. Exécutez : ngrok config add-authtoken VOTRE_TOKEN" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

Write-Host "✅ ngrok est installé !" -ForegroundColor Green
Write-Host ""

# Demander confirmation
Write-Host "📋 Ce script va lancer :" -ForegroundColor Cyan
Write-Host "  1. Backend (port 4000)"
Write-Host "  2. Frontend (port 5173)"
Write-Host "  3. Deux tunnels ngrok"
Write-Host ""
Write-Host "⚠️  IMPORTANT : Gardez cette fenêtre ouverte pendant toute la durée du cours !" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Continuer ? (O/N)"

if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Host "❌ Annulé" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔧 Démarrage des services..." -ForegroundColor Yellow
Write-Host ""

# Démarrer le backend en arrière-plan
Write-Host "📦 Démarrage du backend..." -ForegroundColor Cyan
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 3

# Démarrer ngrok pour le backend
Write-Host "🌐 Création du tunnel ngrok pour le backend..." -ForegroundColor Cyan
$ngrokBackend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 4000 --log=stdout" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 5

# Récupérer l'URL ngrok du backend
Write-Host "🔍 Récupération de l'URL ngrok du backend..." -ForegroundColor Cyan
$ngrokApi = "http://localhost:4040/api/tunnels"
try {
    $response = Invoke-RestMethod -Uri $ngrokApi -Method Get
    $backendUrl = $response.tunnels[0].public_url
    Write-Host "✅ Backend ngrok URL : $backendUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Impossible de récupérer l'URL ngrok automatiquement" -ForegroundColor Red
    $backendUrl = Read-Host "Entrez l'URL ngrok du backend manuellement (ex: https://abc123.ngrok.app)"
}

# Créer le fichier .env.local pour le frontend
Write-Host ""
Write-Host "📝 Configuration du frontend avec l'URL du backend..." -ForegroundColor Cyan
$envContent = "VITE_API_URL=$backendUrl"
Set-Content -Path "$PSScriptRoot\frontend\.env.local" -Value $envContent
Write-Host "✅ Fichier .env.local créé" -ForegroundColor Green

Start-Sleep -Seconds 2

# Démarrer le frontend
Write-Host ""
Write-Host "🌐 Démarrage du frontend..." -ForegroundColor Cyan
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 5

# Démarrer ngrok pour le frontend
Write-Host "🌐 Création du tunnel ngrok pour le frontend..." -ForegroundColor Cyan
$ngrokFrontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 5173 --log=stdout" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 5

# Récupérer l'URL ngrok du frontend
Write-Host "🔍 Récupération de l'URL ngrok du frontend..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $ngrokApi -Method Get
    $frontendUrl = $response.tunnels[1].public_url
    if (-not $frontendUrl) {
        $frontendUrl = $response.tunnels[0].public_url
    }
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "🎉 TOUT EST PRÊT !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 LIEN À PARTAGER AUX ÉTUDIANTS :" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   $frontendUrl" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Message pour les étudiants :" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎮 Blockchain Simulation Game - Club IBC" -ForegroundColor White
    Write-Host "Lien : $frontendUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "1. Ouvrez le lien"
    Write-Host "2. Choisissez 'Mode Solo'"
    Write-Host "3. Entrez votre nom"
    Write-Host "4. Jouez !"
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT :" -ForegroundColor Yellow
    Write-Host "  - Gardez cette fenêtre et les 4 autres fenêtres OUVERTES"
    Write-Host "  - Ne fermez pas avant la fin du cours"
    Write-Host "  - Session ngrok gratuite : 2 heures max"
    Write-Host ""
    Write-Host "🛑 Pour arrêter : Fermez toutes les fenêtres PowerShell" -ForegroundColor Red
    Write-Host ""
} catch {
    Write-Host "❌ Impossible de récupérer l'URL du frontend automatiquement" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Actions manuelles :" -ForegroundColor Yellow
    Write-Host "  1. Regardez la fenêtre ngrok du frontend"
    Write-Host "  2. Copiez l'URL affichée (ex: https://xyz789.ngrok.app)"
    Write-Host "  3. Partagez cette URL aux étudiants"
    Write-Host ""
}

# Copier l'URL dans le presse-papier
if ($frontendUrl) {
    Set-Clipboard -Value $frontendUrl
    Write-Host "📋 URL copiée dans le presse-papier !" -ForegroundColor Green
    Write-Host ""
}

Read-Host "Appuyez sur Entrée pour fermer (les services continueront en arrière-plan)"
