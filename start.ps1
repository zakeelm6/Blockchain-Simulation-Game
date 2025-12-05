# Script de lancement simple et propre
Write-Host "Blockchain Simulation Game - Lancement" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Nettoyer les anciens processus
Write-Host "Nettoyage des anciens processus..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Creer le fichier .env.local
Write-Host "Configuration du frontend..." -ForegroundColor Yellow
$envPath = "$PSScriptRoot\frontend\.env.local"
"VITE_API_URL=http://localhost:4000" | Out-File -FilePath $envPath -Encoding utf8 -NoNewline
Write-Host "Fichier .env.local cree" -ForegroundColor Green
Write-Host ""

# Demarrer le backend
Write-Host "Demarrage du backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Backend ready on http://localhost:4000' -ForegroundColor Green; npm start" -WindowStyle Normal
Start-Sleep -Seconds 5

# Demarrer le frontend
Write-Host "Demarrage du frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Frontend ready on http://localhost:5173' -ForegroundColor Green; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 5

# Ouvrir le navigateur
Write-Host "Ouverture du navigateur..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "APPLICATION LANCEE !" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend  : http://localhost:4000" -ForegroundColor Yellow
Write-Host "Frontend : http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Le navigateur devrait s'ouvrir automatiquement." -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour arreter : Fermez les 2 fenetres PowerShell (backend et frontend)" -ForegroundColor Red
Write-Host ""
Read-Host "Appuyez sur Entree pour fermer cette fenetre"
