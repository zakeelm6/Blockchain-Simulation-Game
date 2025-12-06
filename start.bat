@echo off
echo ========================================
echo  Blockchain Simulation Game - Launcher
echo ========================================
echo.

:: Vérifier si Docker est installé
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Docker n'est pas installe!
    echo.
    echo Telechargez Docker Desktop: https://www.docker.com/products/docker-desktop/
    echo.
    echo Ou lancez manuellement sans Docker:
    echo   1. cd backend ^&^& npm install ^&^& npm start
    echo   2. cd frontend ^&^& npm install ^&^& npm run dev
    echo.
    pause
    exit /b 1
)

echo [OK] Docker est installe
echo.

:: Vérifier si Docker est en cours d'exécution
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Docker Desktop n'est pas demarre!
    echo.
    echo Veuillez demarrer Docker Desktop et reessayer.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker Desktop est en cours d'execution
echo.

echo Demarrage des conteneurs...
docker-compose up -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  Application demarree avec succes!
    echo ========================================
    echo.
    echo  Frontend: http://localhost:5173
    echo  Backend:  http://localhost:4000
    echo.
    echo  Pour voir les logs: docker-compose logs -f
    echo  Pour arreter:      docker-compose down
    echo.
    echo Ouverture du navigateur...
    timeout /t 3 >nul
    start http://localhost:5173
) else (
    echo.
    echo [ERREUR] Echec du demarrage des conteneurs
    echo.
    echo Verifiez les logs avec: docker-compose logs
    echo.
)

pause
