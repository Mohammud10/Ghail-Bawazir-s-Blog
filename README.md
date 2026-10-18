# Smart Calculators Hub

A professional, bilingual (Arabic & English) web application offering free online calculators. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **PostgreSQL**. Completely optimized for SEO and Google AdSense integration.

---

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **i18n**: next-intl v4 (with automatic RTL/LTR directionality)
- **Styling**: Tailwind CSS v4 (logical properties for layout responsiveness)
- **Database**: PostgreSQL (Prisma ORM integration)
- **Authentication**: Auth.js (NextAuth v5) for Admin Dashboard
- **Design Tokens**: Custom palette with Cairo (Arabic) & Inter (English) fonts

---

## Directory Structure
```text
├── messages/                      # i18n JSON translations (ar.json, en.json)
├── prisma/                        # Database schema and seed files
├── src/
│   ├── app/                       # App Router paths
│   │   ├── [locale]/              # Bilingual paths (/ar, /en)
│   │   ├── admin/                 # Admin Dashboard (Auth protected)
│   │   └── api/                   # API routes (contact, search, auth)
│   ├── calculators/               # Pure calculation functions (BMI, Loan, etc.)
│   ├── components/                # Reusable UI, layout, and ad components
│   └── lib/                       # Utility configurations (Prisma, Auth.js)
```

---

## Getting Started

### 1. Prerequisite Installations
- Ensure **Node.js (v18.x or v20.x+)** is installed.
- Setup a **PostgreSQL** database instance locally or in cloud.

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

Modify the parameters:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `AUTH_SECRET`: Generate a random string using `openssl rand -base64 32`.
- `NEXT_PUBLIC_ADSENSE_ENABLED`: Set to `true` to render ads in production.
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: Your Google AdSense Client ID (e.g. `ca-pub-XXXXXXXXXXXXXXXX`).

### 3. Initialize Database and Seed Data
Execute Prisma migrations and populate the database with categories, calculators, settings, and an initial admin account:
```bash
# Apply schema to database
npx prisma db push

# Populate initial categories, ad slots, and calculators
npx prisma db seed
```
> **Default Admin Credentials**:
> - **Email**: `admin@smartcalculators.com`
> - **Password**: `Admin123!`

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the bilingual portal.

---

## Verification & Build
Compile and verify build stability locally:
```bash
npm run build
```

---

## Production Deployment on Hostinger VPS (or Ubuntu Server)

### Step 1: Install Node.js & PostgreSQL
SSH into your VPS and install package dependencies:
```bash
# Update repositories
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 Process Manager globally
sudo npm install pm2 -g

# Install PostgreSQL (Optional, if hosted on the same server)
sudo apt install postgresql postgresql-contrib -y
```

### Step 2: Clone and Configure Project
Upload your code or clone your project on the VPS:
```bash
cd /var/www/smart-calculators
npm install --production=false
```

Create a production `.env` file containing correct database connections and config details:
```bash
nano .env
```
Run migrations and generate Prisma bindings on VPS:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Step 3: Compile App & Start with PM2
```bash
# Build production bundle
npm run build

# Start Next.js server with PM2 Process Manager
pm2 start npm --name "smart-calculators" -- start -- --port 3000

# Configure PM2 to start on system boot
pm2 startup
pm2 save
```

### Step 4: Setup Nginx Reverse Proxy
Install Nginx to route traffic from port 80/443 to Next.js on port 3000:
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/smartcalculators
```

Add the server block config:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/smartcalculators /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Secure with SSL (Certbot)
Enable HTTPS certificate authority:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow instructions to complete configuration.
