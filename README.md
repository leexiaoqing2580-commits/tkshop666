TK Shop - Fullstack (Demo)
===========================

This archive contains a complete fullstack scaffold for TK Shop (Next.js frontend + Express backend + PostgreSQL schema).
It's setup for English UI and includes user login (demo), seller/admin dashboards, fake payment endpoints (USDT/USDC/BTC), and a seed script to create 2000 sample products.

Folders:
- client/   => Next.js frontend (English)
- server/   => Express backend with Prisma (Postgres)
- prisma/   => Prisma schema + seed
- docker-compose.yml => brings up postgres + backend for local testing
- DEPLOY.md => step-by-step deploy instructions (Vercel + Render + Supabase)

Read DEPLOY.md for deployment instructions and quickstart.
