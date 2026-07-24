# Free Deployment Guide — Uyen Ton Portfolio

This guide walks you through deploying the entire portfolio for **free** using:

| Part | Service | Free tier |
|---|---|---|
| Source code hosting | **GitHub** | Free |
| Database (Postgres) | **Neon** | 0.5 GB free |
| Backend (API server) | **Render** | 750 hrs/month free (sleeps when idle) |
| Frontend (website) | **Vercel** | Generous free tier |

> **Note on file uploads:** images and PDFs upload to **Cloudinary** (free tier). Set the three `CLOUDINARY_*` env vars on Render (Step 3). After cutover, re-upload any old Replit-hosted images in admin — legacy `/api/storage/public-objects/*` URLs return 410.

---

## Step 1 — Push code to GitHub

1. Create a new GitHub account (if you don't have one) at https://github.com
2. Create a new **empty** repository (e.g. `uyen-portfolio`). Don't initialize with README.
3. Unzip the project on your computer.
4. Open a terminal in the unzipped folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/uyen-portfolio.git
   git push -u origin main
   ```

---

## Step 2 — Create a free Postgres database (Neon)

1. Go to https://neon.tech and sign up (use your GitHub account).
2. Create a **new project**. Region: pick the one closest to you.
3. After creation, copy the **connection string** (looks like `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`).
4. Save it somewhere safe — you'll paste it into Render in Step 3.

### Load your existing data (optional)

If you want to keep your current projects/posts/settings:
1. The file `portfolio_backup.sql` in the project root is a snapshot of your current database.
2. In Neon's web UI, open the **SQL Editor** and paste/run the contents of `portfolio_backup.sql`.

---

## Step 3 — Deploy the backend to Render

1. Go to https://render.com and sign up with GitHub.
2. Click **New → Web Service**.
3. Connect your `uyen-portfolio` GitHub repo.
4. Configure:
   - **Name:** `uyen-portfolio-api`
   - **Region:** same as Neon
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install -g pnpm && pnpm install && pnpm --filter @workspace/api-server build`
   - **Start Command:** `pnpm --filter @workspace/api-server start`
   - **Plan:** Free
5. Add **Environment Variables** (Settings → Environment):
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon connection string from Step 2 |
   | `SESSION_SECRET` | Any long random string (e.g. mash your keyboard) |
   | `ADMIN_PASSWORD` | Bootstrap password (12+ chars recommended); only used when no hash exists yet |
   | `CORS_ORIGIN` | Your Vercel URL (required in production), e.g. `https://uyen-portfolio.vercel.app` |
   | `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard → API Keys |
   | `CLOUDINARY_API_KEY` | From Cloudinary dashboard → API Keys |
   | `CLOUDINARY_API_SECRET` | From Cloudinary dashboard → API Keys |
   | `CLOUDINARY_FOLDER` | Optional; defaults to `utarch` |
   | `NODE_ENV` | `production` |
   | `PORT` | `8080` |
6. Click **Create Web Service**. First build takes ~5 minutes.
7. When it's live, copy the URL (something like `https://uyen-portfolio-api.onrender.com`). You'll need this for Step 4.

### Initialize the database schema

After the API is live, you need to create the tables. The easiest way:
1. In Render → your service → **Shell** tab.
2. Run: `pnpm --filter @workspace/db push`
3. Type `y` to confirm. Tables are now created.

---

## Step 4 — Deploy the frontend to Vercel

1. Go to https://vercel.com and sign up with GitHub.
2. Click **Add New → Project** → import your `uyen-portfolio` repo.
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `artifacts/portfolio`
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter @workspace/portfolio build`
   - **Output Directory:** `dist/public`
   - **Install Command:** leave blank
4. Add **Environment Variables**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | The Render URL from Step 3 (e.g. `https://uyen-portfolio-api.onrender.com`) |
5. Click **Deploy**. Takes ~3 minutes.

> Set `VITE_API_URL` on Vercel and `CORS_ORIGIN` on Render (Step 5).

---

## Step 5 — Connect frontend to backend

Set these environment variables (no manual code edits required after the bugfix commit):

**Vercel (frontend):**
| Key | Value |
|---|---|
| `VITE_API_URL` | Render API URL, e.g. `https://uyen-portfolio-api.onrender.com` |

**Render (API):**
| Key | Value |
|---|---|
| `CORS_ORIGIN` | Your Vercel URL, e.g. `https://uyen-portfolio.vercel.app` |

The frontend calls `setBaseUrl(VITE_API_URL)` on boot. When `CORS_ORIGIN` is set, the API uses `SameSite=None` cookies so admin login works across domains.

Commit & push — both Vercel and Render will auto-redeploy.

---

## Step 6 — Log in and use it

1. Open your Vercel URL (e.g. `https://uyen-portfolio.vercel.app`)
2. Go to `/admin/login`
3. Use the `ADMIN_PASSWORD` you set in Render's env vars
4. Done!

---

## Tips & Caveats

- **Render free tier sleeps after 15 min of inactivity.** First request after sleep takes ~30 seconds to wake. Pay $7/mo to keep it always-on, or upgrade later.
- **Neon free tier auto-pauses** after 5 min idle but wakes in <1 second.
- **Custom domain:** both Vercel and Render let you add a custom domain for free. Buy one from Namecheap/Porkbun (~$10/year) and follow their setup.
- **File uploads:** create a free Cloudinary account, paste the three API keys into Render, then upload/re-upload images in `/admin`. Stored URLs are absolute CDN links (work with Vercel + Render split).
- **Updates:** any time you change code, just `git push` — Vercel + Render auto-redeploy.

---

## What's in this repo

```
artifacts/
  portfolio/        ← Website (React + Vite)
  api-server/       ← Backend Express API
lib/
  db/               ← Database schema (Drizzle ORM)
  api-spec/         ← OpenAPI spec
  api-client-react/ ← Generated React Query hooks
  api-zod/          ← Generated validation schemas
portfolio_backup.sql  ← Database content snapshot (optional Neon import)
DEPLOYMENT.md         ← This guide
README.md             ← Project overview
```

Good luck. If anything breaks, Render/Vercel logs usually point to the missing env var or build step.
