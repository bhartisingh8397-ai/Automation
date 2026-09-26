@echo off
echo ========================================================
echo Starting Digigyapan Social Media Automation System
echo Frontend: Next.js (http://localhost:3000)
echo Backend: Python Flask (http://localhost:5000)
echo Database: MySQL (digiauto_db)
echo ========================================================

start "Digigyapan Backend (Flask)" cmd /k "cd backend && python run.py"
start "Digigyapan Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo Both services launched in separate windows!
exit /b 0
