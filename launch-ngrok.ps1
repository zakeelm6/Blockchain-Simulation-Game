# Script de lancement automatique avec ngrok
Write-Host "Blockchain Game - Lancement avec ngrok" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Verifier si ngrok.exe existe
if (-not (Test-Path ".\ngrok.exe")) {
    Write-Host "ERREUR: ngrok.exe introuvable !" -ForegroundColor Red
    Write-Host ""
    Write-Host "Telechargez ngrok depuis https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "Extrayez ngrok.exe dans ce dossier" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur Entree pour quitter"
    exit
}

Write-Host "ngrok.exe trouve !" -ForegroundColor Green
Write-Host ""

# Demander confirmation
Write-Host "Ce script va lancer :" -ForegroundColor Cyan
Write-Host "  1. Backend (port 4000)"
Write-Host "  2. Frontend (port 5173)"
Write-Host "  3. Deux tunnels ngrok"
Write-Host ""
Write-Host "IMPORTANT : Gardez toutes les fenetres ouvertes pendant le cours !" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Continuer ? (O/N)"

if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Host "Annule" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Demarrage des services..." -ForegroundColor Yellow
Write-Host ""

# Demarrer le backend
Write-Host "Demarrage du backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start" -WindowStyle Normal
Start-Sleep -Seconds 5

# Demarrer ngrok pour le backend
Write-Host "Creation du tunnel ngrok pour le backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\ngrok.exe http 4000" -WindowStyle Normal
Start-Sleep -Seconds 5

# Recuperer l'URL ngrok du backend
Write-Host "Recuperation de l'URL ngrok du backend..." -ForegroundColor Cyan
$backendUrl = ""
$maxRetries = 10
$retryCount = 0

while ($retryCount -lt $maxRetries -and $backendUrl -eq "") {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method Get -ErrorAction Stop
        if ($response.tunnels -and $response.tunnels.Count -gt 0) {
            $backendUrl = $response.tunnels[0].public_url
        }
    } catch {
        Start-Sleep -Seconds 2
    }
    $retryCount++
}

if ($backendUrl -eq "") {
    Write-Host "Impossible de recuperer l'URL automatiquement" -ForegroundColor Red
    $backendUrl = Read-Host "Entrez l'URL ngrok du backend manuellement"
} else {
    Write-Host "Backend URL : $backendUrl" -ForegroundColor Green
}

# Creer le fichier .env.local pour le frontend
Write-Host ""
Write-Host "Configuration du frontend..." -ForegroundColor Cyan
$envContent = "VITE_API_URL=$backendUrl"
Set-Content -Path "$PSScriptRoot\frontend\.env.local" -Value $envContent -Encoding UTF8
Write-Host "Fichier .env.local cree" -ForegroundColor Green
Start-Sleep -Seconds 2

# Demarrer le frontend
Write-Host ""
Write-Host "Demarrage du frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 8

# Demarrer ngrok pour le frontend
Write-Host "Creation du tunnel ngrok pour le frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\ngrok.exe http 5173" -WindowStyle Normal
Start-Sleep -Seconds 5

# Recuperer l'URL ngrok du frontend
Write-Host "Recuperation de l'URL ngrok du frontend..." -ForegroundColor Cyan
$frontendUrl = ""
$retryCount = 0

while ($retryCount -lt $maxRetries -and $frontendUrl -eq "") {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method Get -ErrorAction Stop
        if ($response.tunnels -and $response.tunnels.Count -gt 1) {
            $frontendUrl = $response.tunnels[1].public_url
        }
    } catch {
        Start-Sleep -Seconds 2
    }
    $retryCount++
}

if ($frontendUrl -eq "") {
    Write-Host "Impossible de recuperer l'URL du frontend automatiquement" -ForegroundColor Red
    $frontendUrl = Read-Host "Entrez l'URL ngrok du frontend manuellement"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "TOUT EST PRET !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "LIEN A PARTAGER AUX ETUDIANTS :" -ForegroundColor Cyan
Write-Host ""
Write-Host "   $frontendUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Message pour les etudiants :" -ForegroundColor Cyan
Write-Host ""
Write-Host "Blockchain Simulation Game - Club IBC"
Write-Host "Lien : $frontendUrl"
Write-Host ""
Write-Host "1. Ouvrez le lien"
Write-Host "2. Choisissez Mode Solo"
Write-Host "3. Entrez votre nom"
Write-Host "4. Jouez !"
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT :" -ForegroundColor Yellow
Write-Host "  - Gardez toutes les fenetres ouvertes"
Write-Host "  - Ne fermez pas avant la fin du cours"
Write-Host "  - Session ngrok : 2 heures max"
Write-Host ""

# Copier l'URL dans le presse-papier
if ($frontendUrl) {
    try {
        Set-Clipboard -Value $frontendUrl
        Write-Host "URL copiee dans le presse-papier !" -ForegroundColor Green
    } catch {
    }
    Write-Host ""
}

Read-Host "Appuyez sur Entree pour fermer cette fenetre"
