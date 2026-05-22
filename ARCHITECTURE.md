# Afari Trails — Project architecture

Monorepo with a **Next.js frontend** and **Express API backend**.

## Repository layout

```
website/
├── frontend/          # Next.js 16 (public site + admin UI)
├── backend/           # Express 5 API (auth, content, future CMS)
├── content/           # (lives in frontend/content — editable JSON)
└── ARCHITECTURE.md
```

---

## Frontend (`frontend/`)

| Folder | Role |
|--------|------|
| `src/app/` | **Routes / pages** (Next.js App Router) |
| `src/components/` | **UI** — `ui/`, `layout/`, feature folders (`home/`, `store/`, …) |
| `src/config/` | **Routes** (`routes.ts`), **env** (`env.ts`) |
| `src/context/` | **Shared React state** (`providers.tsx`) |
| `src/services/` | **API & domain logic** — `api/`, `content/`, `auth/` |
| `src/lib/data/` | Static page copy & product data (TS modules) |
| `src/types/` | Shared TypeScript types |
| `content/` | Editable JSON (homepage images, etc.) |
| `public/` | Static assets (images, hero video) |

### Path alias

`@/*` → `src/*` (see `tsconfig.json`)

### Environment

Copy `frontend/.env.example` → `frontend/.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
ADMIN_SECRET=your-secret
```

### Commands

```bash
cd frontend && npm run dev    # http://localhost:3000
```

---

## Backend (`backend/`)

| Folder | Role |
|--------|------|
| `src/config/` | App config, database connection |
| `src/models/` | Mongoose schemas (`User`, …) |
| `src/routes/` | HTTP route definitions |
| `src/controllers/` | Request handlers (thin) |
| `src/services/` | Business logic |
| `src/middleware/` | Auth, errors |
| `src/app.js` | Express app setup |
| `src/server.js` | Entry point |

### Environment

Copy `backend/.env.example` → `backend/.env`:

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/afari-trails
JWT_SECRET=...
ADMIN_SECRET=...   # same as frontend for content API
```

### Commands

```bash
cd backend && npm install && npm run dev   # http://localhost:4000
```

### API (starter)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create admin (needs MongoDB) |
| POST | `/api/auth/login` | Admin login → JWT |
| GET | `/api/content/homepage` | Homepage CMS JSON |
| PUT | `/api/content/homepage` | Update homepage (header `x-admin-secret`) |

---

## Users (planned)

| Role | Access |
|------|--------|
| **Visitor** | Public frontend only — no login |
| **Admin** | `/admin/*` + API — multiple accounts via backend `User` model + JWT |

Frontend admin today uses `ADMIN_SECRET`; backend is ready for proper multi-admin auth when MongoDB is connected.
