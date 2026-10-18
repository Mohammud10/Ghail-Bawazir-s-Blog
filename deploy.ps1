# =====================================================================
# Smart Calculators Hub - Automated Vercel Deployment Script
# =====================================================================

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Smart Calculators Hub - Vercel Deployer" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Initialize Git if not already done
if (!(Test-Path .git)) {
    Write-Host "[*] Initializing Git repository..." -ForegroundColor Yellow
    git init
    # Configure local credentials to avoid 'identity unknown' error
    git config user.name "Deployer"
    git config user.email "deploy@smartcalculators.com"
    git add .
    git commit -m "Configure Vercel Deployment"
    Write-Host "[+] Git repository initialized and files committed." -ForegroundColor Green
} else {
    Write-Host "[+] Git repository is already initialized." -ForegroundColor Green
}

# 2. Log into Vercel
Write-Host "[*] Checking Vercel login status..." -ForegroundColor Yellow
Write-Host "If you are not logged in, Vercel will open a browser window to authenticate." -ForegroundColor Cyan
npx vercel whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "[*] Logging into Vercel..." -ForegroundColor Yellow
    npx vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Vercel login failed."
        exit 1
    }
}
Write-Host "[+] Vercel session verified." -ForegroundColor Green

# 3. Prompt for Database URL
Write-Host ""
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "Database Configuration" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "You need a hosted PostgreSQL database (e.g. from Supabase or Neon)." -ForegroundColor White
$dbUrl = Read-Host "Enter your production PostgreSQL DATABASE_URL"

if ([string]::IsNullOrEmpty($dbUrl)) {
    Write-Error "DATABASE_URL cannot be empty."
    exit 1
}

# 4. Save database URL to temp env file and setup db
Write-Host "[*] Temporarily setting DATABASE_URL and running database seed..." -ForegroundColor Yellow
$originalEnv = ""
if (Test-Path .env.local) {
    $originalEnv = Get-Content .env.local -Raw
}

# Write DB URL temporarily to run prisma tasks
Set-Content -Path .env.local -Value "DATABASE_URL=`"$dbUrl`""

Write-Host "[*] Running Prisma db push..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Error "Prisma db push failed. Check your database connection string and try again."
    # Restore env
    if (![string]::IsNullOrEmpty($originalEnv)) {
        Set-Content -Path .env.local -Value $originalEnv
    }
    exit 1
}

Write-Host "[*] Running Prisma db seed..." -ForegroundColor Yellow
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
    Write-Error "Prisma db seed failed."
    # Restore env
    if (![string]::IsNullOrEmpty($originalEnv)) {
        Set-Content -Path .env.local -Value $originalEnv
    }
    exit 1
}

# Restore original .env.local
if (![string]::IsNullOrEmpty($originalEnv)) {
    Set-Content -Path .env.local -Value $originalEnv
} else {
    Remove-Item .env.local -Force
}
Write-Host "[+] Database tables created and seeded successfully!" -ForegroundColor Green

# 5. Generate Auth Secret
Write-Host "[*] Generating secure AUTH_SECRET..." -ForegroundColor Yellow
$authSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Min 0 -Max 256) }))

# 6. Start Vercel Deployment Link and configure env variables
Write-Host ""
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "Vercel Deploying..." -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

# Run vercel link/deploy to setup the project config
Write-Host "[*] Creating Vercel project and setting up configurations..." -ForegroundColor Yellow
npx vercel link --yes

# Push environment variables to Vercel project
Write-Host "[*] Setting up environment variables on Vercel..." -ForegroundColor Yellow
npx vercel env add DATABASE_URL "$dbUrl" production --yes
npx vercel env add AUTH_SECRET "$authSecret" production --yes
npx vercel env add NEXT_PUBLIC_ADSENSE_ENABLED "false" production --yes
npx vercel env add NEXT_PUBLIC_SITE_NAME "Smart Calculators Hub" production --yes

# 7. Deploy production build
Write-Host "[*] Executing production deploy on Vercel..." -ForegroundColor Yellow
npx vercel deploy --prod --yes

if ($LASTEXITCODE -ne 0) {
    Write-Error "Vercel deployment failed."
    exit 1
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "   🎉 CONGRATULATIONS! DEPLOYMENT COMPLETE! 🎉" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Your website is live and connected to your database." -ForegroundColor White
Write-Host ""
