$ErrorActionPreference = "Stop"

$rootDir = "c:\Aerofisc"
$excludeDirs = @(".git", "node_modules", "target", "dist", ".vercel", ".gemini", ".agents", "playwright-report")
$extensions = @(".java", ".js", ".jsx", ".html", ".xml", ".properties", ".md", ".json", ".sql", ".yml", ".ps1")

function Get-Files {
    Get-ChildItem -Path $rootDir -Recurse | Where-Object {
        $file = $_
        if ($file.PSIsContainer) { return $false }
        
        $skip = $false
        foreach ($exclude in $excludeDirs) {
            if ($file.FullName -match "\\$exclude\\") {
                $skip = $true
                break
            }
        }
        if ($skip) { return $false }
        
        if ($extensions -contains $file.Extension) { return $true }
        
        # Files without extension like COPYRIGHT, Dockerfile
        if (-not $file.Extension) { return $true }
        
        return $false
    }
}

Write-Host "Finding files to modify..."
$files = Get-Files

$count = 0
foreach ($file in $files) {
    # Read file content
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    } catch {
        continue
    }
    
    if (-not $content) { continue }
    
    $modified = $false
    $newContent = $content
    
    # Case sensitive replacements
    if ($newContent -match "Aerofisc") {
        $newContent = $newContent -replace "Aerofisc", "Aerofisc"
        $modified = $true
    }
    if ($newContent -match "Aerofisc") {
        $newContent = $newContent -replace "Aerofisc", "aerofisc"
        $modified = $true
    }
    if ($newContent -match "Aerofisc") {
        $newContent = $newContent -replace "Aerofisc", "AEROFISC"
        $modified = $true
    }
    # Case insensitive catch-all for remaining (like Aerofisc)
    if ($newContent -match "Aerofisc") {
        $newContent = $newContent -replace "Aerofisc", "aerofisc"
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Modified: $($file.FullName)"
        $count++
    }
}

Write-Host "Successfully modified $count files."

