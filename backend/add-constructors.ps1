# Auto-generate constructors for services
$services = @(
    "AdminService",
    "AnomalyDetectionService",
   "AuthService",
    "BudgetAdvisorService",
    "BudgetService",
    "CategorizationService",
    "CategoryService",
    "DashboardService",
    "DropboxService",
    "InvestmentService",
    "PredictionService",
    "SavingsGoalService",
    "TransactionService",
    "UserService",
    "WebSocketService"
)

foreach ($serviceName in $services) {
    $file = "c:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\$serviceName.java"
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Skip if constructor already exists
        if ($content -match "public $serviceName\s*\(") {
            Write-Host "Skipped (already has constructor): $serviceName"
            continue
        }
        
        # Extract class declaration line
        if ($content -match "(?s)(@Service[\r\n\s]+)?public class $serviceName.*?\{(.*?)(?=\r?\n\s*(@|public |private |protected |\}))" ) {
            $classBody = $Matches[2]
            
            # Extract all private final fields
            $fields = [regex]::Matches($classBody, "private final ([a-zA-Z0-9<>,\s]+) (\w+);")
            
            if ($fields.Count -eq 0) {
                Write-Host "Skipped (no final fields): $serviceName"
                continue
            }
            
            # Build constructor parameters and assignments
            $params = @()
            $assignments = @()
            
            foreach ($field in $fields) {
                $type = $field.Groups[1].Value.Trim()
                $name = $field.Groups[2].Value.Trim()
                $params += "$type $name"
                $assignments += "        this.$name = $name;"
            }
            
            $constructor = "`r`n    public $serviceName(" + ($params -join ", ") + ") {`r`n"
            $constructor += ($assignments -join "`r`n") + "`r`n    }`r`n"
            
            # Find insertion point (after last field)
            $lastField = $fields[$fields.Count - 1]
            $insertPoint = $lastField.Index + $lastField.Length
            
            # Insert constructor
            $before = $content.Substring(0, $insertPoint)
            $after = $content.Substring($insertPoint)
            $newContent = $before + $constructor + $after
            
            Set-Content -Path $file -Value $newContent -NoNewline
            Write-Host "Added constructor: $serviceName"
        }
    }
}

Write-Host "Constructor generation complete!"

