# TaskFlow — Modern MERN Stack Task Manager

> A high-performance, minimalist, and accessible full-stack task management application built with TypeScript, Node.js, Express, MongoDB Atlas, React 18, and Tailwind CSS. Built as a hiring technical assessment for Hammoq Infosystems Pvt. Ltd.

---

## 🔗 Live Application & Demo Credentials

- **Frontend Application:** *Deploying to Netlify (e.g. `https://taskflow-app.netlify.app`)*
- **Backend API:** *Deploying to Render (e.g. `https://taskflow-api.onrender.com`)*
- **API Health Check:** `GET /api/health`

### Demo Credentials
| Field | Value |
|---|---|
| **Email** | `demo@taskflow.dev` |
| **Password** | `Password123!` |

*(You can also register your own account with instant verification and isolated task storage.)*

---

## ✨ Features Built

- **Robust Authentication & Data Isolation:**
  - Secure signup & login using salted bcrypt password hashing (12 rounds) and JWT stored in httpOnly, SameSite cookies (XSS protected).
  - Complete per-user data isolation: every task query is strictly scoped on the server to the authenticated user ID.
  - Automatic session restoration on page reload (`GET /api/auth/me`).
- **Comprehensive Task Management (CRUD):**
  - Create tasks with title (validated 1-100 chars), rich description, priority (low, medium, high), status, and due dates.
  - Quick-complete checkbox with instant optimistic UI update.
  - Inline editing and confirmation dialog for deletions.
- **Dynamic Search, Filtering & Sorting:**
  - Real-time debounced search (300ms) with keyboard shortcut (`/` to focus).
  - Status segmented control (`All`, `To Do`, `In Progress`, `Done`).
  - Priority filter (`All`, `High`, `Medium`, `Low`).
  - Multi-attribute sorting by Created Date, Due Date, or Priority (Ascending / Descending).
  - Full synchronization of search, filters, sort, and pagination with the **URL query string** for shareable, persistent views.
- **Dashboard Metrics & Visual Indicators:**
  - Real-time stats bar showing counts for Total Tasks, To Do, In Progress, Completed, and Overdue tasks.
  - Overdue indicator with relative due date calculation (e.g., "Due tomorrow", "2 days overdue").
  - Pulse-animated skeleton loaders and distinct empty states for clean initial list vs. no search results.
- **Accessibility & UX Polish:**
  - Light and Dark mode with instant theme toggle, persisted in `localStorage` and matching system preference.
  - Accessible focus rings, modal dialogs with focus trapping, `Esc` to close, and keyboard shortcuts (`N` for new task, `/` for search).
  - Toast feedback for every operation using `sonner`.

---

## 🛠 Tech Stack

### Frontend (`/client`)
| Technology | Role |
|---|---|
| **React 18 + Vite** | High-speed frontend build tool & component framework |
| **TypeScript (Strict)** | End-to-end type safety with no `any` |
| **Tailwind CSS** | Design tokens, custom color palette, responsive utilities |
| **TanStack Query v5** | Server state management, cache invalidation & optimistic updates |
| **React Router v6** | Route protection and code-split lazy routes (`React.lazy` + `Suspense`) |
| **React Hook Form + Zod** | Schema-driven form validation and inline error feedback |
| **Axios** | Single configured HTTP client with credentials and 401 interceptor |
| **Lucide React** | Consistent, modern icon set |
| **Sonner** | Accessible notification toasts |
| **Date-fns** | Relative dates and overdue timestamp calculations |

### Backend (`/server`)
| Technology | Role |
|---|---|
| **Node.js + Express** | High-performance backend API runtime & framework |
| **TypeScript (Strict)** | Strict compile-time validation |
| **MongoDB + Mongoose** | Document database with compound indexes (`user + status + createdAt`, `user + dueDate`) |
| **Zod** | Runtime request body, query, and param validation middleware |
| **JWT + Cookie-Parser** | Secure session management in `httpOnly` cookies |
| **Bcryptjs** | Password hashing (salt cost 12) |
| **Helmet & CORS** | Security headers and origin-allowed credential handling |
| **Express-Rate-Limit** | Brute-force protection on authentication routes (20 req / 15 min) |
| **Morgan** | Request logging |

---

## 📐 Architecture & Layering Rules

```
task-manager/
├── client/                     # Vite + React + TypeScript frontend
│   ├── src/
│   │   ├── app/                # App bootstrap, router with lazy routes, guards, providers
│   │   ├── modules/
│   │   │   ├── auth/           # Auth API, hooks, forms, pages, schemas, types
│   │   │   └── tasks/          # Task API, hooks, components, modal, pages, schemas, types
│   │   ├── shared/             # Reusable UI library, layout components, hooks, axios, utils
│   │   └── styles/             # Tailwind directives and CSS variables
└── server/                     # Express + TypeScript backend
    └── src/
        ├── config/             # Zod-validated env config & Mongoose connection
        ├── middlewares/        # JWT auth, generic Zod validator, error and 404 handlers
        ├── modules/
        │   ├── auth/           # Auth routes, controller, service, and schemas
        │   ├── users/          # User Mongoose model and types
        │   └── tasks/          # Task routes, controller, service, model, and schemas
        ├── routes/             # Top-level API router mounting /auth, /tasks, /health
        └── utils/              # AppError, asyncHandler, cookie, and JWT utilities
```

### Strict Server Layering
The backend enforces a unidirectional separation of concerns:
$$\text{Routes} \longrightarrow \text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Model}$$
- **Routes:** Define HTTP methods, wire validation and authentication middlewares.
- **Controllers:** Extract request data, invoke the service, and shape standardized JSON responses. No business logic.
- **Services:** Contain pure business logic and MongoDB operations. Independent of `req`/`res`.
- **Models:** Define Mongoose schemas, compound indexes, and JSON transformations.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- MongoDB Atlas URI or local MongoDB instance (`mongodb://localhost:27017/taskmanager`)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd task-manager

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment Variables Configuration

**Server (`server/.env`):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=super-secret-jwt-key-task-manager-at-least-32-chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Locally
In separate terminals:

```bash
# Terminal 1 - Backend (starts on http://localhost:5000)
cd server
npm run dev

# Terminal 2 - Frontend (starts on http://localhost:5173)
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📡 API Reference Table

Base path: `/api`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/health` | No | Liveness and health check |
| `POST` | `/auth/register` | No | Create user account & set httpOnly JWT cookie |
| `POST` | `/auth/login` | No | Authenticate user & set httpOnly JWT cookie |
| `POST` | `/auth/logout` | Yes | Invalidate session & clear auth cookie |
| `GET` | `/auth/me` | Yes | Fetch currently authenticated user session |
| `GET` | `/tasks` | Yes | List tasks (supports `status`, `priority`, `search`, `sortBy`, `order`, `page`, `limit`) |
| `GET` | `/tasks/stats` | Yes | Fetch counts for total, todo, in_progress, done, overdue |
| `POST` | `/tasks` | Yes | Create a new task owned by the authenticated user |
| `GET` | `/tasks/:id` | Yes | Fetch a single task by ID |
| `PATCH` | `/tasks/:id` | Yes | Partially update task fields (title, status, priority, dueDate, etc.) |
| `DELETE` | `/tasks/:id` | Yes | Permanently delete a task |

### Standard Response Formats

**Success Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "67a1c8f5e4b0a1d2e3f4a5b6",
      "title": "Complete code review",
      "status": "todo",
      "priority": "high",
      "dueDate": "2026-10-20T00:00:00.000Z",
      "createdAt": "2026-10-15T10:00:00.000Z"
    }
  },
  "meta": {
    "page": 1,
    "limit": 9,
    "total": 1,
    "totalPages": 1
  }
}
```

**Validation Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title cannot be empty"
    }
  ]
}
```

---

## 💡 Architectural Decisions, Non-Goals & Limitations

### 1. Three Most Important Decisions Made
1. **httpOnly Cookie JWT instead of localStorage:**
   Storing JWT tokens in `localStorage` leaves credentials vulnerable to Cross-Site Scripting (XSS) attacks. By utilizing `httpOnly`, `SameSite: "none"` (in production) and `secure: true` cookies, JavaScript execution cannot extract the token.
2. **Server-Side Ownership Scoping:**
   Rather than trusting client-sent user IDs, all database operations filter tasks strictly using the verified `req.user.id` extracted from the decoded JWT payload. Accessing or updating another user's task safely returns a 404 Not Found without leaking resource existence.
3. **Modular Feature Architecture with a Service Layer & Boundary Validation:**
   Instead of grouping by file type, features are isolated into `auth` and `tasks` modules. Controllers handle HTTP mechanics while services encapsulate pure business rules. Zod schemas validate both inputs on the client and enforce strict integrity on the API boundaries.

### 2. Three Features Deliberately NOT Implemented
1. **Real-time Collaboration & Multi-User Task Sharing:**
   Requires WebSocket connection management, room permissions, and concurrent edit conflict resolution (OT/CRDTs). Given the assessment focus on core engineering and scope discipline, this was excluded in favor of per-user reliability.
2. **Drag-and-Drop Kanban Board:**
   Adds heavy bundle overhead and complex touch/keyboard accessibility challenges. The status tabs and quick-complete controls achieve the same workflow with higher responsiveness and cleaner state synchronization.
3. **Automated Email / Push Notifications & Background Cron Jobs:**
   Requires dedicated background worker queues (BullMQ/Redis) and external third-party mail providers (Resend/SendGrid), introducing operational dependencies outside the self-contained scope.

### 3. Limitation & Future Work
- **Current Limitation:** Authentication uses a single 7-day JWT token stored in an httpOnly cookie without refresh token rotation or server-side blacklisting/revocation.
- **With More Time:** Implement a dual-token strategy with short-lived access tokens (15m) and rotating refresh tokens hashed in MongoDB, server-side revocation on logout, rate limiting by user ID, and automated integration test coverage via Jest and Supertest.

---

## 🚢 Deployment Guide

1. **MongoDB Atlas:** Provision a free M0 cluster, configure Network Access `0.0.0.0/0`, and copy connection string.
2. **Render (Backend API):**
   - Connect GitHub repository, set Root Directory to `server`.
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/server.js`
   - Environment Variables: `NODE_ENV=production`, `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.
   - *Note on Render Free Tier:* Web services spin down after 15 minutes of inactivity; the initial cold start may take ~30–50 seconds.
3. **Netlify (Frontend Client):**
   - Connect repository, set Base Directory to `client`.
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment Variable: `VITE_API_URL=https://your-api.onrender.com/api`
   - SPA routing is preserved via `public/_redirects` (`/* /index.html 200`).
