# BlogEra - Front End

A full-featured blog management frontend built with **Next.js (App Router)** and **Tailwind CSS**, consuming the [Blog REST API](../backend) backend. Supports three visitor types — Guest, User, and Admin — with real authentication, role-based access, and every page backed by live API data (no mocked or hardcoded content).

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Demo Credentials](#demo-credentials)
- [Backend Dependency](#backend-dependency)
- [Application Routes](#application-routes)
- [User & Admin Functionality](#user--admin-functionality)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)

## Project Overview

BlogEra lets guests browse and search published blogs, registered users manage their own blog posts and profile, and admins manage every user and every blog in the system. Every screen — from the homepage to the admin user table — is driven entirely by the backend REST API; nothing is hardcoded or mocked.

## Main Features

- Guest blog browsing with search and category filtering
- Registration, login, forgot/reset password
- Persistent authentication state (survives page refresh via a stored JWT)
- Protected routes (`/dashboard/*`) and role-gated routes (`/admin/*`), enforced client-side for UX *and* respected from the backend's real 401/403 responses
- Profile management: edit name, upload a profile image (updates the navbar avatar instantly, no re-login required), change password
- Full blog CRUD: create, edit, delete (with confirmation), list as a table
- Admin user management: view all users, view a single user's details, activate/deactivate accounts
- Loading states, empty states, and human-readable error messages throughout
- Responsive layout: collapsible sidebar drawer on mobile, stacking blog cards, scrollable tables

## Technologies

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| HTTP client | Axios |
| Auth | JWT stored client-side, `Authorization: Bearer <token>` on every protected request |

## Installation

```bash
git clone <this-repo-url>
cd frontend
npm install
```

## Environment Variables

Copy `.env.example` to `.env.local` and point it at your running backend:

```bash
cp .env.example .env.local
```

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend REST API | `http://localhost:5000/api` |

`.env.local` is git-ignored — never commit real environment values.

## Running the Application

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). The backend (see [Backend Dependency](#backend-dependency)) must be running for any page to show real data.

## Demo Credentials

Seeded directly in the backend database — use these to log in and explore each role without registering a new account:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@test.com` | `admin1234` |

Register a new account via `/register` to try the User role, or promote any registered account to admin by setting `role = 'admin'` on its row in the `users` table (there is no self-promotion endpoint, by design).

### Registration rules

The `/register` form requires:

| Field | Rule |
|---|---|
| Email | Standard `something@domain.tld` pattern (validated client-side and re-checked by the backend) |
| Password | At least 8 characters |
| First name, Last name | Required, non-empty |

Client-side validation (`utils/validators.js`) mirrors the backend's own rules exactly, so a submission that passes locally will also pass the API — it's a UX shortcut, not a replacement for the backend's real validation.

**Example registration:**

| Field | Value |
|---|---|
| First name | `Iffat` |
| Last name | `Nishat` |
| Email | `iffatnishat54+demo@gmail.com` |
| Password | `demo1234` |

This is a real registered account in the database (Gmail's `+demo` alias tag routes to the same inbox), created via a live `POST /register` call, not a hypothetical example.

## Backend Dependency

This frontend has **no data of its own** — it is a pure client for the [Blog REST API](../backend). Start the backend first:

```bash
cd ../backend
npm install
npm run dev
```

By default the backend listens on `http://localhost:5000` and exposes everything under `/api`. See the backend's own README for its environment variables (database, JWT secret, SMTP credentials for password-reset emails).

## Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage — browse/search/filter blogs |
| `/blogs/[id]` | Public | Blog detail page |
| `/login` | Public | Login |
| `/register` | Public | Registration |
| `/forgot-password` | Public | Request a password reset email |
| `/reset-password/[token]` | Public | Set a new password from the emailed link |
| `/dashboard` | User, Admin | Dashboard home — stats, profile summary, recent blogs |
| `/dashboard/blogs` | User, Admin | Blog management table ("My Blogs" / "All Blogs") |
| `/dashboard/blogs/create` | User, Admin | Create a blog |
| `/dashboard/blogs/[id]/edit` | User, Admin | Edit a blog (owner or admin) |
| `/dashboard/profile` | User, Admin | View/edit profile, upload avatar |
| `/dashboard/change-password` | User, Admin | Change password |
| `/admin/users` | Admin only | All users table, activate/deactivate |
| `/admin/users/[id]` | Admin only | Single user detail |

Unauthenticated visitors hitting a `/dashboard/*` route are redirected to `/login`. Non-admins hitting an `/admin/*` route see an **Access Denied** screen — this is a UX convenience only; the backend's own role check is the real authorization boundary.

## User & Admin Functionality

**Registered users** can log in, manage their profile and avatar, change their password, and create/update/delete their own blogs.

**Admins** additionally see every user's blogs (labeled "All Blogs") and can edit or delete any of them, and have a **Users** section to view, and activate/deactivate, any account.

## Project Structure

```
app/
├── page.jsx                          # Homepage
├── layout.jsx                        # Root layout (wraps everything in AuthProvider)
├── blogs/[id]/page.jsx               # Blog detail
├── login/, register/, forgot-password/, reset-password/[token]/
├── dashboard/
│   ├── layout.jsx                    # Auth guard + DashboardShell
│   ├── page.jsx                      # Dashboard home
│   ├── blogs/page.jsx                # Blog table
│   ├── blogs/create/page.jsx
│   ├── blogs/[id]/edit/page.jsx
│   ├── profile/page.jsx
│   └── change-password/page.jsx
└── admin/
    ├── layout.jsx                    # Admin-only guard + DashboardShell
    └── users/page.jsx, users/[id]/page.jsx

components/         # Navbar, Sidebar, ProfileMenu, BlogCard, BlogForm, SearchBar,
                     # CategoryFilter, Loader, ConfirmDialog, Avatar, and more
services/            # auth.service.js, user.service.js, blog.service.js — one
                     # function per backend endpoint, nothing else touches axios directly
contexts/
└── AuthContext.jsx  # Auth state, login/logout, profile refresh
utils/
├── api.js           # Axios instance, auth header injection, 401 handling
├── auth.js          # Token storage helpers
├── validators.js    # Client-side validation (mirrors backend rules)
└── formatDate.js
```

## Screenshots

Screenshots are organized by role in [`Screenshots/`](../Screenshots/), covering every page each role is allowed to use.

### Guest (public, unauthenticated)
![Homepage](../Screenshots/Guest/01-homepage.png)
![Blog detail](../Screenshots/Guest/02-blog-detail.png)
![Register](../Screenshots/Guest/03-register.png)
![Login](../Screenshots/Guest/04-login.png)
![Forgot password](../Screenshots/Guest/05-forgot-password.png)
![Reset password](../Screenshots/Guest/06-reset-password.png)

### User (authenticated, normal role)
![Dashboard](../Screenshots/User/01-dashboard.png)
![My Blogs](../Screenshots/User/02-my-blogs.png)
![Create blog](../Screenshots/User/03-create-blog.png)
![Edit blog](../Screenshots/User/04-edit-blog.png)
![Profile](../Screenshots/User/05-profile.png)
![Change password](../Screenshots/User/06-change-password.png)

### Admin
![Dashboard](../Screenshots/Admin/01-dashboard.png)
![All Blogs](../Screenshots/Admin/02-all-blogs.png)
![Create blog](../Screenshots/Admin/03-create-blog.png)
![Users](../Screenshots/Admin/04-users.png)
![User detail](../Screenshots/Admin/05-user-detail.png)
![Profile](../Screenshots/Admin/06-profile.png)

### Mobile view
<img src="../Screenshots/Mobile View/01-homepage-mobile.png" alt="Mobile homepage" width="300" />
<img src="../Screenshots/Mobile View/02-blog-detail-mobile.png" alt="Mobile blog detail" width="300" />
<img src="../Screenshots/Mobile View/03-login-mobile.png" alt="Mobile login" width="300" />
<img src="../Screenshots/Mobile View/04-register-mobile.png" alt="Mobile register" width="300" />
<img src="../Screenshots/Mobile View/05-dashboard-drawer-mobile.png" alt="Mobile sidebar drawer" width="300" />
<img src="../Screenshots/Mobile View/06-admin-users-mobile.png" alt="Mobile admin users" width="300" />
