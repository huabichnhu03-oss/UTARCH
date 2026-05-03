# Uyen Ton Portfolio

## Overview

A full-stack portfolio website for Uyen Ton, Architectural Technologist. Features a public-facing blueprint-grid aesthetic portfolio and a full admin panel for managing all content.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/portfolio), deployed at `/`
- **API framework**: Express 5 (artifacts/api-server), deployed at `/api`
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **File Storage**: Replit Object Storage (GCS-backed)
- **Auth**: bcryptjs + express-session (password-based admin)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Admin Access

- URL: `/admin/login`
- Default password: `admin123` (change via Settings page after first login)

## Features

### Public Site
- Hero section with large architectural title + hero image
- Info bar (e.g. "BASED IN TORONTO, ON")
- About + Skills section (grid)
- Projects archive grid (4-column)
- Individual project detail pages with methodology steps + gallery
- Blog/posts listing and detail pages
- Contact footer

### Admin Panel (`/admin`)
- **Projects**: Create, edit, delete, publish/unpublish; manage methodology steps and gallery images
- **Posts**: Create, edit, delete, publish/unpublish blog posts
- **Skills**: Add/delete/reorder technical skills
- **Settings**: Edit all site content (name, title, subtitle, hero image, about text, info bar, contact info), change admin password
- **Uploads**: Upload images to object storage, copy returned URL for use in forms

## Database Tables

- `site_settings` — Singleton row of all site configuration
- `projects` — Portfolio projects with JSONB methodology steps & gallery
- `posts` — Blog/news posts
- `skills` — Technical skills list

## Design

Crimson Red theme: signature red (#C0392B) as primary, warm charcoal (#2D2D2D) as accent, clean white background, 1px solid border system, Space Mono for technical labels, Inter for body text. All colors flow through CSS variables (`--c-blue` for primary, `--c-accent` for accent) and are overridable at runtime via the admin Settings panel. The 3D BuildingModel uses a matching red material palette.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
