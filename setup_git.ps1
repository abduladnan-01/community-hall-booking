$dest = "C:\Users\abdul\AppData\Local\Programs\Git"
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}
$zip = "$dest\mingit.zip"
Write-Host "Downloading MinGit..."
curl.exe -k -L -o $zip "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/MinGit-2.47.1-64-bit.zip"

Write-Host "Extracting MinGit..."
Expand-Archive -Path $zip -DestinationPath $dest -Force
Remove-Item $zip -Force

$gitExe = "$dest\cmd\git.exe"
if (Test-Path $gitExe) {
    Write-Host "Git installed successfully!"
    & $gitExe --version
    
    # Add to user PATH permanently
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$dest\cmd*") {
        [Environment]::SetEnvironmentVariable("Path", "$dest\cmd;$userPath", "User")
        Write-Host "Added Git to user PATH."
    }
}

