# BlogEra

A full-stack **Blog Management Application** built with a Node.js/Express/MySQL REST API paired with a Next.js + Tailwind CSS frontend, supporting three roles: **Guest**, **User**, and **Admin**.

Built strictly against the specs: no hardcoded users, no mock data, no frontend-only authentication — every screen is driven by real backend API calls.

## What's in this repo

| Folder | What it is |
|---|---|
| [`backend/`](backend) | Express REST API — auth (JWT), users, blogs, password reset emails, profile image upload. See [`backend/README.md`](backend/README.md) for full API docs, env setup, and the DB schema. |
| [`frontend/`](frontend) | Next.js (App Router) + Tailwind CSS client — public blog browsing, auth pages, a role-aware dashboard, and admin user management. See [`frontend/README.md`](frontend/README.md) for routes, setup, and project structure. |
| [`Screenshots/`](Screenshots) | Live screenshots of the running app, organized by role: `Guest/`, `User/`, `Admin/`, and `Mobile View/`. |

## What the app does

- **Guests** can browse, search, and filter published blogs by category, and read full blog posts — no login required.
- **Users** can register, log in, manage their profile (including a profile picture), change their password, and create/edit/delete their own blogs from a dashboard.
- **Admins** get everything a User has, plus a Users management page (view/activate/deactivate any account) and the ability to edit or delete *any* user's blog.
- Auth is JWT-based end-to-end: the frontend stores the token and sends `Authorization: Bearer <token>` on every protected request, and both frontend route guards *and* the backend's own 401/403 responses enforce access — the frontend never trusts itself alone.

## Quick start

```bash
# Backend (http://localhost:5000)
cd backend
npm install
cp .env.example .env   # fill in real DB/JWT/SMTP values
npm run dev

# Frontend (http://localhost:3000)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Full setup details, environment variables, and API/route references live in each package's own README linked above.

## Tech stack

**Backend:** Node.js, Express 5, Sequelize (MySQL), JWT, bcrypt, multer, nodemailer, cors
**Frontend:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Axios
