# Afari Trails — Project architecture

Monorepo: **Next.js frontend** + **Express API** + **MongoDB**.

## Repository layout

```
website/
├── frontend/          # Next.js 16 (public site + admin UI)
├── backend/           # Express 5 API (auth, users, CMS content)
├── docker-compose.yml # MongoDB for local dev
├── package.json       # Run API + web together
└── ARCHITECTURE.md
```

---

## Quick start

```bash
# From repo root
npm install
npm run db:up          # starts MongoDB (Docker)
npm run db:seed        # super admin + homepage in MongoDB

npm run dev            # API :4000 + site :3000
```

Sign in: http://localhost:3000/admin/login  
Default: `admin@afaritrails.com` / `changeme123` (see `backend/.env`)

---

## Backend (`backend/`)

| Layer | Role |
|--------|------|
| `src/models/` | Mongoose schemas (`User`, `HomepageContent`) |
| `src/services/` | Business logic |
| `src/routes/` | HTTP routes |
| `src/middleware/` | JWT auth, RBAC |
| `scripts/seed.js` | Super admin + homepage seed |

### Environment (`backend/.env`)

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/afari-trails
JWT_SECRET=...
ADMIN_EMAIL=admin@afaritrails.com
ADMIN_PASSWORD=changeme123
```

### API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health + DB status |
| POST | `/api/auth/login` | — | Staff login → JWT |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/staff/users` | JWT + super_admin | List staff |
| POST | `/api/staff/users` | JWT + super_admin | Create staff |
| PATCH | `/api/staff/users` | JWT + super_admin | Update staff |
| DELETE | `/api/staff/users/:id` | JWT + super_admin | Delete staff |
| GET | `/api/content/homepage` | — | Public homepage CMS |
| PUT | `/api/content/homepage` | JWT + editor+ | Update homepage |

### Roles (MongoDB `User.role`)

| Role | Access |
|------|--------|
| `super_admin` | Users + all CMS |
| `admin` | Full CMS |
| `editor` | Edit homepage |
| `viewer` | Read-only admin |

---

## Frontend (`frontend/`)

- **Public pages** load homepage from API (`getHomepageAsync`) with JSON fallback.
- **Admin** uses NextAuth; login calls `POST /api/auth/login` on the backend.
- JWT stored in session as `accessToken` for staff API calls.
- Image/video uploads still write to `frontend/public/` then sync metadata to MongoDB.

### Environment (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
```

---

## Data flow

```
Browser → Next.js (3000) → Express API (4000) → MongoDB
                ↓
         public/ (images, videos)
```

Staff accounts and homepage content live in **MongoDB**. The frontend no longer uses SQLite/Prisma for auth.
