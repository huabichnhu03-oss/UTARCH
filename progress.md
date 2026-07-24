# UTARCH — Progress Tracker

Last updated: 2026-07-22

## Audit summary

Portfolio monorepo (React/Vite + Express + Drizzle/Postgres). Core app is keepable for GitHub/Vercel/Render. Remaining: finish env cutover (Cloudinary + deploy secrets), OpenAPI sync, optional server Zod.

---

## Checklist

### P0 — Security (task 1)

- [x] Login rate limit
- [x] JSON body limit `1mb`
- [x] Require `CORS_ORIGIN` in production
- [x] Postgres session store
- [x] Upload MIME allowlist + Cloudinary
- [x] Password min length (12)
- [x] Neutral site_settings defaults
- [x] Frontend `plans` in `projectSchema`
- [ ] Server-side Zod on mutating routes

### P1 — Deploy storage (task 2)

- [x] Cloudinary uploads (CDN URLs)
- [x] Remove Replit GCS client
- [x] Document Cloudinary in DEPLOYMENT.md / README
- [x] Set Cloudinary + other secrets (local `.env`)
- [x] Deploy Neon schema push (`drizzle-kit push`)
- [x] Push to GitHub (`huabichnhu03-oss/UTARCH`)
- [x] Vercel frontend live — https://utarch.vercel.app
- [ ] Render API deploy (blueprint ready; needs dashboard login)
- [ ] Set `CORS_ORIGIN=https://utarch.vercel.app` on Render

### P2 — Tidy (task 3)

- [x] Delete mockup-sandbox, scripts, attached_assets, Replit configs
- [x] Remove unused portfolio shadcn dump
- [x] Remove dead object-storage helpers
- [x] Portfolio deps already trimmed
- [x] Fix Windows-breaking `export` in API `dev` script
- [x] Add `.env.example`

### P3 — Contract & docs (task 4)

- [ ] Sync OpenAPI + regenerate clients
- [ ] Kill leftover Replit-only notes if any
- [ ] Deploy Neon → Render → Vercel with env vars

---

## Suggested order

1. Security ← mostly done
2. Cloudinary storage ← code done; **need your API keys**
3. Tidy ← done this session
4. OpenAPI + codegen
5. Deploy with your env values

---

## Session log

### 2026-07-22

- Recreated `progress.md` (was missing again).
- Fixed API `dev` script for Windows; added dotenv + `.env.example`.
- Waiting on secrets list below before Render/local upload testing.

### 2026-07-21

- Bugfix pushed to UTARCH; audit; security + tidy + Cloudinary code.
