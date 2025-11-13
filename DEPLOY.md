TK Shop Deployment Guide (Vercel frontend + Render backend + Supabase/Postgres)
===============================================================================

1) Push repo to GitHub
   - Create a new GitHub repo and push this project (root level).

2) Deploy backend to Render (or Railway)
   - Create a new Web Service on Render, connect GitHub repo, select `server/` folder as root.
   - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start command: `node index.js`
   - Add environment variables on Render:
       DATABASE_URL=postgres://<user>:<pass>@<host>:5432/<db>
       JWT_SECRET=choose_a_strong_secret

   - Alternatively use Docker with docker-compose (see quickstart below).

3) Deploy frontend to Vercel
   - Create new project, import this repo, set Root Directory to `client`.
   - Add Environment Variables (in Vercel project settings):
       NEXT_PUBLIC_API_BASE = https://<your-backend-url>
   - Deploy. Vercel will build Next.js and serve frontend.

4) Database (Supabase or Managed Postgres)
   - Create a Postgres DB (Supabase recommended).
   - Copy the DATABASE_URL to Render environment variables.
   - Run Prisma migrations and seed (see Quickstart).

Quickstart (local, recommended to test):
---------------------------------------
- Install Docker and Docker Compose.
- From repo root run:
    docker-compose up -d
- In another terminal:
    cd server
    npm install
    export DATABASE_URL="postgres://postgres:postgres@localhost:5432/tkshop"
    npx prisma migrate dev --name init
    node prisma/seed.js
- Start backend (if not started by docker):
    node index.js
- Start frontend:
    cd client
    npm install
    npm run dev
- Open http://localhost:3000
