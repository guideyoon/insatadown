$WshShell = New-Object -comObject WScript.Shell
$StartupDir = $WshShell.SpecialFolders.Item("Startup")
$ShortcutPath = "$StartupDir\StartNgrok.lnk"
$TargetFile = "$PSScriptRoot\start_ngrok.bat"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetFile
$Shortcut.WorkingDirectory = "$PSScriptRoot"
$Shortcut.Save()

Write-Host "Shortcut created at $ShortcutPath"
