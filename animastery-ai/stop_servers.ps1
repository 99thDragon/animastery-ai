# Stop any running Python processes (backend)
Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "python main.py" } | Stop-Process -Force

# Stop any running Node processes (frontend)
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "npm start" } | Stop-Process -Force

Write-Host "Servers have been stopped." 