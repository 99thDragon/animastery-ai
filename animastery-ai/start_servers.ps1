# Start backend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/backend'; python main.py"

# Start frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/frontend'; npm start"

Write-Host "Servers are starting..."
Write-Host "Backend will be available at: http://localhost:8000"
Write-Host "Frontend will be available at: http://localhost:3000" 