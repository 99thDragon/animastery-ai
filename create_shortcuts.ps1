$WshShell = New-Object -comObject WScript.Shell

# Create Backend Shortcut
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Backend.lnk")
$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = "/c `"cd `"$PWD\animastery-ai\backend`" && python main.py`""
$Shortcut.WorkingDirectory = "$PWD"
$Shortcut.Description = "Start Animation Rag Backend Server"
$Shortcut.Save()

# Create Frontend Shortcut
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Frontend.lnk")
$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = "/c `"cd `"$PWD\animastery-ai\frontend`" && npm start`""
$Shortcut.WorkingDirectory = "$PWD"
$Shortcut.Description = "Start Animation Rag Frontend Server"
$Shortcut.Save() 