# Security Features Test Suite

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Aerofisc SECURITY FEATURES TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"
$testResults = @()

function Test-Feature {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    try {
        & $Test
        Write-Host "  ✓ PASSED" -ForegroundColor Green
        $script:testResults += [PSCustomObject]@{Feature = $Name; Result = "PASSED" }
    }
    catch {
        Write-Host "  ✗ FAILED: $_" -ForegroundColor Red
        $script:testResults += [PSCustomObject]@{Feature = $Name; Result = "FAILED: $_" }
    }
    Write-Host ""
}

# Test 1: Password Validation - Weak Password
Test-Feature "Password Validation (Weak Password)" {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"test@example.com","password":"weak","username":"testuser"}' `
        -ErrorAction Stop
    
    if ($response.StatusCode -eq 400) {
        throw "Expected 400 status code"
    }
}

# Test 2: Password Validation - Strong Password
Test-Feature "Password Validation (Strong Password)" {
    $email = "test$(Get-Random)@example.com"
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body "{`"email`":`"$email`",`"password`":`"Strong123!`",`"username`":`"testuser$(Get-Random)`",`"firstName`":`"Test`",`"lastName`":`"User`",`"monthlyIncome`":5000,`"savingsTarget`":1000}" `
        -ErrorAction Stop
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200 status code, got $($response.StatusCode)"
    }
}

# Test 3: Rate Limiting
Test-Feature "Rate Limiting (6 rapid login attempts)" {
    Write-Host "  Attempting 6 rapid login requests..." -ForegroundColor Gray
    $attempts = 0
    $rateLimited = $false
    
    for ($i = 1; $i -le 6; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" `
                -Method POST `
                -ContentType "application/json" `
                -Body '{"email":"test@example.com","password":"wrong"}' `
                -ErrorAction Stop
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                $rateLimited = $true
                Write-Host "  Rate limited on attempt $i" -ForegroundColor Gray
                break
            }
        }
        $attempts++
    }
    
    if (-not $rateLimited) {
        throw "Expected to be rate limited after 5 attempts"
    }
}

# Test 4: Admin Authorization (requires existing admin user)
Test-Feature "Admin Authorization (attempt access without auth)" {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/audit/all" `
            -Method GET `
            -ErrorAction Stop
        throw "Expected 401 or 403, got $($response.StatusCode)"
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -ne 401 -and $statusCode -ne 403) {
            throw "Expected 401 or 403, got $statusCode"
        }
    }
}

# Test 5: Session Management Endpoints
Test-Feature "Session Management (GET /api/sessions without auth)" {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/sessions" `
            -Method GET `
            -ErrorAction Stop
        throw "Expected 401, got $($response.StatusCode)"
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -ne 401) {
            throw "Expected 401, got $statusCode"
        }
    }
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$testResults | Format-Table -AutoSize

$passed = ($testResults | Where-Object { $_.Result -eq "PASSED" }).Count
$total = $testResults.Count
Write-Host ""
Write-Host "Passed: $passed/$total" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
Write-Host ""

Write-Host "Note: Some tests require manual verification:" -ForegroundColor Yellow
Write-Host "  - Token rotation: Login, then use refresh endpoint and verify new token" -ForegroundColor Gray
Write-Host "  - Session management: Login and access /api/sessions with valid token" -ForegroundColor Gray
Write-Host "  - Admin endpoints: Login as admin and access /api/audit/all" -ForegroundColor Gray

