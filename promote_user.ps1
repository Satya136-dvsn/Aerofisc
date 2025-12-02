param(
    [Parameter(Mandatory = $true)]
    [string]$Email,

    [Parameter(Mandatory = $false)]
    [string]$Role = "ADMIN"
)

Write-Host "Updating user $Email to role $Role..."

# Run the SQL update inside the Docker container
docker exec -i budgetwisetracker-db-1 mysql -u root -proot budgetwise -e "UPDATE users SET user_role = '$Role' WHERE email = '$Email';"

if ($?) {
    Write-Host "Success! User $Email is now a $Role." -ForegroundColor Green
    Write-Host "Verifying change..."
    docker exec -i budgetwisetracker-db-1 mysql -u root -proot budgetwise -e "SELECT email, user_role FROM users WHERE email = '$Email';"
}
else {
    Write-Host "Error updating user. Please check if Docker is running." -ForegroundColor Red
}
