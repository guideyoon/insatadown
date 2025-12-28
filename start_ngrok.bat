@echo off
cd /d "%~dp0"
start "Next.js App" npm run dev
timeout /t 10
ngrok http 3000
