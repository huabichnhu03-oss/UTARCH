# Project notes (legacy)

This project was originally developed on Replit. Day-to-day docs live in:

- [README.md](./README.md) — overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) — GitHub / Neon / Render / Vercel

## Features

### Public site
- Hero, about, skills, projects archive, project detail, posts, contact footer

### Admin (`/admin`)
- Projects, posts, skills, settings, uploads

## Database tables

- `site_settings`, `projects`, `posts`, `skills`, plus `session` (connect-pg-simple)
