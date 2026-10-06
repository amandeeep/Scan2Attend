# 🔧 Scan2Attend — Backend

> Express.js REST API server for the Scan2Attend attendance management system.

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js + Express 5** | REST API server |
| **MongoDB (Mongoose)** | Primary database & ODM |
| **Upstash Redis** | OTP storage with TTL auto-expiry |
| **Cloudinary** | Profile picture uploads & CDN delivery |
| **Resend** | Transactional email delivery (OTPs) |
| **JWT** | Authentication via HTTP-only cookies |
| **bcryptjs** | Password hashing (10 salt rounds) |
| **Multer** | Multipart form data / file upload handling |
| **Nodemon** | Development auto-restart |

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── server.js                   # Express app entry point (port 3001)
│   │
│   ├── config/
│   │   ├── cloudinary.js           # Cloudinary upload helper
│   │   ├── redis.js                # Upstash Redis REST client
│   │   ├── resend.js               # Resend email client
│   │   └── mail.js                 # Email templates & sender utility
│   │
│   ├── lib/
│   │   ├── db.js                   # MongoDB connection (Mongoose)
│   │   └── redisClient.js          # Redis client instance
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification + role-based user resolution
│   │   └── multerMiddleware.js     # File upload handling (memory storage)
│   │
│   ├── models/
│   │   ├── College.js              # College schema & password hashing
│   │   ├── Teacher.js              # Teacher schema & password hashing
│   │   ├── Student.js              # Student schema with attendance details
│   │   ├── Subject.js              # Subject schema with enrolled students/teachers
│   │   └── Attendance.js           # Attendance records with compound unique index
│   │
│   ├── controllers/
│   │   ├── authController.js       # Signup, Login, Logout, OTP, Password Reset, Onboard, AddUser
│   │   ├── attendanceController.js # Mark, View, Update attendance
│   │   ├── profileController.js    # Fetch authenticated user profile
│   │   └── subjectController.js    # Add subjects, Enroll students, Get subjects
│   │
│   └── routes/
│       ├── auth.js                 # /api/auth/*
│       ├── attendance.js           # /api/attendance/*
│       ├── profile.js              # /api/profile/*
│       └── subject.js              # /api/subject/*
│
├── uploads/                        # Temporary upload directory (Multer)
├── .env                            # Environment variables (not committed)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas cluster (or local MongoDB instance)
- Upstash Redis account
- Cloudinary account
- Resend account

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3001

# Database
MONGOOSE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Authentication
JWT_SECRET_KEY=your_jwt_secret_key

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
RESEND_SENDER_EMAIL=onboarding@resend.dev

# File Storage (Cloudinary)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The server starts at **http://localhost:3001**.

---

## 📡 API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|:----:|------|-------------|
| `POST` | `/signup` | ✗ | `{ fullName, email, password, role }` | Register a new user (student / teacher / college) |
| `POST` | `/login` | ✗ | `{ email, password, role }` | Login and receive JWT cookie |
| `POST` | `/logout` | ✗ | — | Clear JWT & session cookies |
| `POST` | `/send-otp` | ✗ | `{ email }` | Generate & send 6-digit OTP via email |
| `POST` | `/verify-otp` | ✗ | `{ email, otp }` | Verify OTP against Redis store |
| `POST` | `/reset-password` | ✗ | `{ email, newPassword }` | Reset user password |
| `POST` | `/onboard` | ✓ | `FormData: { profilePic, ...fields }` | Complete profile onboarding (multipart upload) |
| `POST` | `/addUser` | ✓ | `{ fullName, email, password, role }` | College admin creates a teacher/student account |

### Profile — `/api/profile`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/user` | ✓ | Fetch the authenticated user's profile |

### Subjects — `/api/subject`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|:----:|------|-------------|
| `POST` | `/add` | ✓ | `{ name, code, department, semester }` | Create a new subject |
| `POST` | `/enroll` | ✓ | `{ subjectCode, studentIds }` | Enroll students into a subject |
| `POST` | `/get-subjects/` | ✓ | — | Get subjects for the current user |
| `POST` | `/get-subjects/:id` | ✓ | — | Get subjects by a specific user ID |

### Attendance — `/api/attendance`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|:----:|------|-------------|
| `POST` | `/mark` | ✓ | `{ studentID, subjectCode, date, status, source }` | Mark attendance for students |
| `POST` | `/mark/:id` | ✓ | Same as above | Mark attendance (alternate route) |
| `GET` | `/view` | ✓ | Query params | View attendance records |
| `PUT` | `/update` | ✓ | `{ attendanceId, status }` | Update an attendance record |

---

## 🗃️ Data Models

### College

| Field | Type | Notes |
|-------|------|-------|
| `fullName` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Min 6 chars, bcrypt hashed |
| `collegeId` | String | Unique, sparse index |
| `address` | String | — |
| `profilePic` | String | Cloudinary URL |
| `contactNumber` | Number | — |
| `isOnboard` | Boolean | Default: `false` |
| `isOtpVerified` | Boolean | Default: `false` |

### Teacher

| Field | Type | Notes |
|-------|------|-------|
| `fullName` | String | Required |
| `email` | String | Required, unique |
| `password` | String | bcrypt hashed |
| `teacherId` | String | Unique identifier |
| `collegeId` | String | Associated college ID |
| `collegeObjectId` | ObjectId | Reference to College |
| `department` | String | — |
| `gender` | String | Enum: male, female, other |
| `age` | Number | — |
| `profilePic` | String | Cloudinary URL |
| `isOnboard` | Boolean | Default: `false` |
| `isOtpVerified` | Boolean | Default: `false` |

### Student

| Field | Type | Notes |
|-------|------|-------|
| `fullName` | String | Required |
| `email` | String | Required, unique |
| `password` | String | bcrypt hashed |
| `studentID` | String | Unique student identifier |
| `rollNumber` | Number | — |
| `department` | String | — |
| `semester` | Number | — |
| `gender` | String | Enum: male, female, other |
| `age` | Number | — |
| `collegeId` | ObjectId | Reference to College |
| `profilePic` | String | Cloudinary URL |
| `isOnboard` | Boolean | Default: `false` |
| `isOtpVerified` | Boolean | Default: `false` |
| `attendanceDetails` | Object | Embedded attendance summary |

### Subject

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Subject name |
| `code` | String | Unique subject code |
| `department` | String | — |
| `semester` | Number | — |
| `students` | Array | Enrolled student ObjectIds |
| `studentIds` | Array | Enrolled student IDs (string) |
| `teacherId` | Array | Assigned teacher IDs |
| `collegeId` | ObjectId | Reference to College |

### Attendance

| Field | Type | Notes |
|-------|------|-------|
| `studentID` | String | Student identifier |
| `subjectCode` | String | Subject code |
| `collegeId` | String | College identifier |
| `teacherId` | String | Teacher who marked |
| `teacherDetails` | Object | Denormalized teacher snapshot |
| `studentDetails` | Object | Denormalized student snapshot |
| `date` | Date | Attendance date |
| `status` | String | Enum: `present`, `absent` |
| `source` | String | Enum: `manual`, `biometric` |
| `branch` | String | Department/branch |

> **Compound unique index:** `(studentID, subjectCode, date)` — prevents duplicate entries per student per subject per day.

---

## 🔒 Authentication & Middleware

### Auth Middleware (`authMiddleware.js`)

1. Extracts JWT from `req.cookies.jwt`
2. Verifies token with `JWT_SECRET_KEY`
3. Resolves user from the correct Mongoose model based on `role` claim (student / teacher / college)
4. Attaches to request: `req.user`, `req.role`, `req.id`, `req.objectId`
5. On `TokenExpiredError`: clears cookies and returns `401`

### Multer Middleware (`multerMiddleware.js`)

- Handles `multipart/form-data` for profile picture uploads
- Uses memory storage for buffer-based Cloudinary upload
- Configured for single file upload (`profilePic` field)

---

## 🌐 CORS Configuration

Allowed origins:
- `http://localhost:5173` — local development
- `https://scan2attend.onrender.com` — production

Credentials (`cookies`) are enabled for cross-origin auth.

---

## 👤 Author

**Amandeep Singh**

---

## 📄 License

[ISC](https://opensource.org/licenses/ISC)
