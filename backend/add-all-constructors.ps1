# Find and add constructors to ALL service classes automatically
$servicesPath = "c:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service"

Get-ChildItem -Path $servicesPath -Filter "*.java" | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw
    
    # Extract class name
    if ($content -match "@Service[\r\n\s]+public class (\w+)") {
        $className = $Matches[1]
        
        # Check if constructor exists
        if ($content -match "public $className\s*\(") {
            Write-Host "Skip (has constructor): $className"
            return
        }
        
        # Extract all private final fields
        $fields = [regex]::Matches($content, "private final ([a-zA-Z0-9<>,\s]+?)\s+(\w+);")
        
        if ($fields.Count -eq 0) {
            Write-Host "Skip (no final fields): $className"
            return
        }
        
        # Build constructor
        $params = @()
        $assignments = @()
        
        foreach ($field in $fields) {
            $type = $field.Groups[1].Value.Trim()
            $name = $field.Groups[2].Value.Trim()
            $params += "$type $name"
            $assignments += "        this.$name = $name;"
        }
        
        $constructor = "`r`n`r`n    public $className(" + ($params -join ", ") + ") {`r`n"
        $constructor += ($assignments -join "`r`n") + "`r`n   }"
        
        # Find where to insert (after last final field)
        $lastFieldMatch = $fields[$fields.Count - 1]
        $insertAfter = $lastFieldMatch.Index + $lastFieldMatch.Length
        
        # Insert constructor
        $before = $content.Substring(0, $insertAfter)
        $after = $content.Substring($insertAfter)
        $newContent = $before + $constructor + $after
        
        Set-Content -Path $file -Value $newContent -NoNewline
        Write-Host "Added constructor: $className ($($fields.Count) fields)"
    }
}

Write-Host "`n=== Constructor generation complete! ==="

