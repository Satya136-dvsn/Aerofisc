$ErrorActionPreference = "Stop"

function Test-Login {
    param($email, $password)
    $url = "http://localhost:8080/api/auth/login"
    $body = @{ email = $email; password = $password } | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Method Post -Uri $url -ContentType "application/json" -Body $body
        return $response.accessToken
    } catch { return $null }
}

$token = Test-Login "verify_advanced@test.com" "Password@123"
if (-not $token) {
    Write-Host "Please register verify_advanced@test.com manually if needed."
    exit
}

$headers = @{ Authorization = "Bearer $token" }

# 1. Update Profile (Income = 15,00,000)
Write-Host "`n--- Updating Profile ---"
$profileBody = @{ firstName="Verify"; lastName="User"; monthlyIncome=125000; savingsTarget=20000 } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Put -Uri "http://localhost:8080/api/profile" -Headers $headers -ContentType "application/json" -Body $profileBody | Out-Null
    Write-Host "Profile Updated."
} catch { Write-Host "Profile Update Failed: $($_.Exception.Message)" }

# 2. Add Debt
Write-Host "`n--- Adding Debt ---"
$debtBody = @{ name="Test Debt"; type="PERSONAL_LOAN"; principal=1000; currentBalance=1000; interestRate=10; minimumPayment=100 } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/debts" -Headers $headers -ContentType "application/json" -Body $debtBody | Out-Null
    Write-Host "Debt Added."
} catch { Write-Host "Debt Add Failed: $($_.Exception.Message)" }

# 3. Verify Tax Estimate
Write-Host "`n--- Tax Estimate ---"
try {
    $tax = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/tax/estimate" -Headers $headers
    Write-Host "Taxable Income: $($tax.taxableIncome)"
    Write-Host "Estimated Tax: $($tax.estimatedTax)"
} catch { Write-Host "Tax Failed: $($_.Exception.Message)" }

# 4. Verify Debt Payoff
Write-Host "`n--- Debt Payoff (Avalanche) ---"
try {
    $plan = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/debts/payoff-plan?strategy=AVALANCHE&extraPayment=5000" -Headers $headers
    Write-Host "Payoff Date: $($plan.payoffDate)"
    Write-Host "Total Interest: $($plan.totalInterestPaid)"
} catch { Write-Host "Debt Payoff Failed: $($_.Exception.Message)" }

# 5. Verify Financial Health
Write-Host "`n--- Financial Health ---"
try {
    $health = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/financial-health/score" -Headers $headers
    Write-Host "Health Score: $($health.healthScore)"
    Write-Host "Status: $($health.healthRating)"
} catch { Write-Host "Health Failed: $($_.Exception.Message)" }

# 6. Verify Scenario Analysis
Write-Host "`n--- Scenario Analysis ---"
try {
    $scenario = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/scenarios/analyze?incomeChange=20&expenseChange=0" -Headers $headers
    Write-Host "Projected Net Worth (1Y): $($scenario.projectedBalance1Year)"
} catch { Write-Host "Scenario Failed: $($_.Exception.Message)" }
