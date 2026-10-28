$server = Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "server/src/index.js" -WorkingDirectory "C:\Users\abdul\.gemini\antigravity\scratch\riverside-community-hall" -PassThru
Start-Sleep -Seconds 3
try {
    & "C:\Program Files\nodejs\node.exe" "C:\Users\abdul\.gemini\antigravity\brain\82801ec6-2f46-46c8-81b9-ff60bf1a0475\scratch\test_system.js"
} finally {
    if ($server -and !$server.HasExited) {
        Stop-Process -Id $server.Id -Force
    }
}

