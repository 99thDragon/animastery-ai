# Kill any existing Node.js and Python processes
Get-Process | Where-Object { $_.ProcessName -eq "node" -or $_.ProcessName -eq "python" } | Stop-Process -Force

# Start the backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python main.py"

# Start the frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start" 