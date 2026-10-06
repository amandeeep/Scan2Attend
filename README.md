# 📋 Scan2Attend

> **Mark your presence** — A full-stack college attendance management system with role-based dashboards for Colleges, Teachers, and Students.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Deployed on Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=white)](https://scan2attend.onrender.com)

---

## 🌐 Live Demo

| Service  | URL |
|----------|-----|
| Frontend | [scan2attend.onrender.com](https://scan2attend.onrender.com) |
| Backend  | [scan2attend-backend.onrender.com](https://scan2attend-backend.onrender.com) |

---

## ✨ Features

### 🏛️ College Admin
- Sign up & OTP email verification
- Onboarding with profile picture upload
- Create teacher & student accounts
- Overview dashboard

### 👨‍🏫 Teacher
- Create subjects (code, name, department, semester)
- Enroll students into subjects
- Mark attendance (manual / biometric source)
- View attendance statistics

### 🎓 Student
- View enrolled subjects
- Check per-subject attendance records & percentage
- Personal dashboard

### 🔐 Common
- JWT-based authentication with HTTP-only cookies
- OTP verification via email (Resend API + Upstash Redis)
- Profile picture upload via Cloudinary
- Password reset flow
- Dark / light theme toggle (DaisyUI)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│         React 19 · Vite 7 · Redux Toolkit · TailwindCSS │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP (Axios)
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  REST API (Express 5)                    │
│     JWT Auth Middleware · Multer · CORS (whitelist)      │
└───┬──────────┬──────────────┬────────────────┬───────────┘
    │          │              │                │
    ▼          ▼              ▼                ▼
 MongoDB   Upstash Redis   Cloudinary     Resend Email
 (Atlas)   (OTP store)     (CDN/media)    (transactional)
```

---

## 🗂️ Project Structure

```
Scan2Attend/
├── backend/                # Express.js REST API server
│   ├── src/
│   │   ├── server.js       # Entry point
│   │   ├── config/         # Cloudinary, Redis, Resend, email
│   │   ├── controllers/    # Auth, Attendance, Profile, Subject
│   │   ├── lib/            # DB connection, Redis client
│   │   ├── middleware/     # JWT auth, Multer file upload
│   │   ├── models/         # Mongoose schemas (College, Teacher, Student, Subject, Attendance)
│   │   └── routes/         # Express route definitions
│   └── package.json
│
├── frontend/Scan2Attend/   # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx         # Route definitions & role-based guards
│   │   ├── store/          # Redux slices (auth, user, theme)
│   │   ├── AuthPages/      # Login, Signup, OTP, Password Reset
│   │   ├── CollegePages/   # College dashboard & onboarding
│   │   ├── TeacherPages/   # Teacher dashboard, attendance marking, subject management
│   │   ├── StudentPages/   # Student dashboard & attendance view
│   │   └── components/     # Shared components (Navbar, Sidebar, AddUser, PhotoCrop, etc.)
│   └── package.json
│
├── system_design.md        # Detailed system design documentation
└── README.md               # ← You are here
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Redux Toolkit, React Router v7 |
| **UI** | TailwindCSS, DaisyUI, MUI v7, Lucide React, React Icons |
| **Tables** | TanStack React Table, AG Grid |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Cache** | Upstash Redis (OTP storage with TTL) |
| **File Storage** | Cloudinary (profile pictures) |
| **Email** | Resend (OTP delivery) |
| **Auth** | JWT (HTTP-only cookies) + bcryptjs |
| **Uploads** | Multer |
| **Deployment** | Render (static site + web service) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- **MongoDB Atlas** cluster (or local MongoDB)
- **Upstash Redis** account
- **Cloudinary** account
- **Resend** account

### 1. Clone the repository

```bash
git clone https://github.com/amandeeep/Scan2Attend.git
cd Scan2Attend
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=3001
MONGOOSE_URL=your_mongodb_atlas_connection_string

JWT_SECRET_KEY=your_jwt_secret

UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

RESEND_API_KEY=your_resend_api_key
RESEND_SENDER_EMAIL=onboarding@resend.dev

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the dev server:

```bash
npm run dev
```

The backend runs at **http://localhost:3001**.

### 3. Set up the Frontend

```bash
cd frontend/Scan2Attend
npm install
```

Create a `.env` file in `frontend/Scan2Attend/`:

```env
VITE_BACKEND_URL=http://localhost:3001/api
VITE_FRONTEND_URL=http://localhost:5173
```

Start the dev server:

```bash
npm run dev
```

The frontend runs at **http://localhost:5173**.

---

## 📡 API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/signup` | ✗ | Register a new user |
| `POST` | `/api/auth/login` | ✗ | Login with email & password |
| `POST` | `/api/auth/logout` | ✗ | Clear JWT cookie |
| `POST` | `/api/auth/send-otp` | ✗ | Send OTP to email |
| `POST` | `/api/auth/verify-otp` | ✗ | Verify OTP code |
| `POST` | `/api/auth/reset-password` | ✗ | Reset password |
| `POST` | `/api/auth/onboard` | ✓ | Complete onboarding (with profile pic) |
| `POST` | `/api/auth/addUser` | ✓ | College adds teacher/student |
| `POST` | `/api/profile/user` | ✓ | Get authenticated user profile |
| `POST` | `/api/subject/add` | ✓ | Create a subject |
| `POST` | `/api/subject/enroll` | ✓ | Enroll students in a subject |
| `POST` | `/api/subject/get-subjects/` | ✓ | Get subjects for current user |
| `POST` | `/api/attendance/mark` | ✓ | Mark attendance |
| `GET` | `/api/attendance/view` | ✓ | View attendance records |
| `PUT` | `/api/attendance/update` | ✓ | Update attendance records |

> See the [backend README](./backend/README.md) for detailed API documentation.

---

## 🔐 Security

| Aspect | Implementation |
|--------|---------------|
| Password Storage | bcrypt with 10 salt rounds (Mongoose `pre("save")` hook) |
| Session Management | JWT in HTTP-only cookies (not localStorage) |
| OTP Verification | Time-limited OTPs in Redis with auto-expiry |
| CORS | Whitelist-based origin validation |
| Token Expiry | Auth middleware clears cookies on `TokenExpiredError` |
| File Uploads | Multer middleware + Cloudinary for safe storage |

---

## 👤 Author

**Amandeep Singh**

---

