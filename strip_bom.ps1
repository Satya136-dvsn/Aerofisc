$files = Get-ChildItem -Path "c:\Aerofisc" -File -Recurse -Include *.java, *.properties, *.xml, *.js, *.jsx, *.css, *.html, *.json, *.sql, *.md

foreach ($f in $files) {
    # Check if file has BOM
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        Write-Host "Removing BOM from $($f.FullName)"
        $contentBytes = $bytes[3..($bytes.Length - 1)]
        [System.IO.File]::WriteAllBytes($f.FullName, $contentBytes)
    }
}
Write-Host "Done"
