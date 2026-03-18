
$uniqueEmail = "test_" + (Get-Date -Format "yyyyMMddHHmmss") + "@example.com"
Write-Host "Trying to register $uniqueEmail"

try {
    $reg = Invoke-RestMethod -Uri http://localhost:8080/api/v1/auth/register -Method Post -ContentType "application/json" -Body "{`"name`":`"Test User`", `"email`":`"$uniqueEmail`", `"password`":`"password123`"}"
    $token = $reg.token
    Write-Host "Registration Successful. Token obtained."
} catch {
    Write-Host "Registration Failed: $($_.Exception.Message). Trying to login..."
    try {
        $login = Invoke-RestMethod -Uri http://localhost:8080/api/v1/auth/authenticate -Method Post -ContentType "application/json" -Body '{"email":"fix@example.com", "password":"password123"}'
        $token = $login.token
        Write-Host "Login Successful. Token obtained."
    } catch {
        Write-Host "Login Failed: $($_.Exception.Message)"
        exit
    }
}

Write-Host "Token: $token"

try {
    $postResponse = Invoke-RestMethod -Uri http://localhost:8080/api/v1/posts -Method Post -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body '{"title":"Post from Script", "content":"Testing the fix", "mainCategoryId":2, "subCategoryIds":[], "status":"PUBLISHED"}'
    Write-Host "Post Created: $($postResponse | ConvertTo-Json)"
} catch {
    Write-Host "Post Creation Failed: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        $details = $_.ErrorDetails | ConvertFrom-Json
        Write-Host "Error Details: $($details | ConvertTo-Json)"
    }
}
