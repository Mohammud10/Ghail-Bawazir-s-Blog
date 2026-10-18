# Deploying Smart Calculators Hub on Vercel

Vercel provides first-class support for Next.js applications. This guide will walk you through deploying the **Smart Calculators Hub** project on Vercel with a live database.

---

## 📋 Requirements
1. A **GitHub**, **GitLab**, or **Bitbucket** account.
2. A **Vercel** account (free Hobby tier is sufficient).
3. A hosted **PostgreSQL** database (e.g., from [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)).

---

## 🛠️ Step-by-Step Deployment

### Step 1: Create a Hosted Database
Prisma and NextAuth require a live database. Set up a free PostgreSQL database:
- **Supabase**: Create a project, navigate to **Project Settings > Database**, and copy the **Transaction Connection String** (port 5432 or 6543 pooler URL).
- **Neon**: Create a project, copy the connection string from the dashboard.

### Step 2: Push Your Code to GitHub
Initialize git in your project directory and push to a new GitHub repository:
```bash
# Initialize git
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit of Smart Calculators Hub"

# Link and push to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/smart-calculators-hub.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Select your **GitHub** repository (`smart-calculators-hub`) and click **Import**.
3. Under **Environment Variables**, add the following required keys:
   
   | Key | Value Example | Notes |
   |---|---|---|
   | `DATABASE_URL` | `postgresql://postgres:pwd@db-host:5432/postgres` | Your hosted Postgres connection string |
   | `AUTH_SECRET` | `generate-a-long-random-string-here` | Run `openssl rand -base64 32` to generate |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app-domain.vercel.app` | Your Vercel domain URL |
   | `NEXT_PUBLIC_SITE_NAME` | `Smart Calculators Hub` | Website name |
   | `NEXT_PUBLIC_ADSENSE_ENABLED` | `false` | Set `true` once AdSense is approved |

4. Click **Deploy**. Vercel will install dependencies, automatically run `prisma generate` (configured in the `postinstall` script), and build your production application.

---

## 🗄️ Database Migrations & Seeding on Vercel

Since Vercel is a serverless platform, you need to apply migrations and seed the database (add initial categories, calculators, and admin account) from your local computer pointing to the hosted database.

### Step 1: Point your local environment to the production database
In your local `.env.local` file, temporarily replace the `DATABASE_URL` with your **live hosted database URL** (from Supabase/Neon).

### Step 2: Run Prisma Commands Locally
Run these commands locally to push tables and seed data to your hosted database:
```bash
# Apply schema to the hosted database
npx prisma db push

# Seed default categories, 5 calculators, settings, and admin account
npx prisma db seed
```

Once completed, you can change your local `.env.local` back to your local development database if you wish. Your Vercel deployment will now have access to all calculators and categories!

---

## 📈 Troubleshooting
- **Prisma Client not found**: Ensure `"postinstall": "prisma generate"` is present in the `scripts` block of `package.json` (I've already added this for you!).
- **Prisma Schema validation errors**: Ensure the `DATABASE_URL` is correct. If using Supabase, prefer using connection pooling URLs (usually port 6543).
- **RTL layout issues**: The project is pre-built using Tailwind logical properties and auto-detects English/Arabic paths, so no extra settings are required.
