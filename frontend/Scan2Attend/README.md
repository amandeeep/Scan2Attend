# 🎨 Scan2Attend — Frontend

> React SPA with role-based dashboards for the Scan2Attend attendance management system.

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library |
| **Vite 7** | Build tool with fast HMR |
| **Redux Toolkit** | Global state management |
| **React Router v7** | Client-side routing with role-based guards |
| **TailwindCSS 3** | Utility-first CSS framework |
| **DaisyUI 4** | TailwindCSS component library with theme support |
| **MUI v7** | Material UI components |
| **Lucide React** | Icon library |
| **React Icons** | Additional icon library |
| **TanStack React Table** | Headless data table |
| **AG Grid** | Enterprise-grade data grid |
| **Axios** | HTTP client for API requests |
| **React Hot Toast** | Toast notifications |
| **React Easy Crop** | Image cropping for profile pictures |
| **React OTP Input** | OTP input component |
| **React Pro Sidebar** | Sidebar navigation |

---

## 📁 Directory Structure

```
frontend/Scan2Attend/
├── public/                          # Static assets
├── src/
│   ├── App.jsx                      # Root component — route definitions & role-based guards
│   ├── main.jsx                     # Entry point — Redux Provider & BrowserRouter
│   ├── index.css                    # Global styles (TailwindCSS directives)
│   │
│   ├── store/                       # Redux state management
│   │   ├── appStore.js              # Store configuration
│   │   ├── authSlice.js             # Auth state (isAuthenticated, role, onboarded)
│   │   ├── userSlice.js             # User profile data
│   │   └── themeSlice.js            # Theme toggle state (DaisyUI themes)
│   │
│   ├── AuthPages/                   # Authentication views
│   │   ├── LoginPage.jsx            # Email + password login with role selection
│   │   ├── SignUpPage.jsx           # New user registration
│   │   ├── OtpPage.jsx             # OTP verification screen
│   │   ├── ForgotPasswordPage.jsx   # Request password reset
│   │   └── NewPasswordPage.jsx      # Set new password
│   │
│   ├── CollegePages/                # College admin dashboard
│   │   ├── CollegeBody.jsx          # Layout wrapper (sidebar + navbar + outlet)
│   │   ├── CollegeHome.jsx          # College dashboard / home
│   │   ├── CollegeNavbar.jsx        # College-specific navbar
│   │   ├── CollegeSidebar.jsx       # College-specific sidebar
│   │   └── CollegeOnboard.jsx       # College onboarding form
│   │
│   ├── TeacherPages/                # Teacher dashboard & tools
│   │   ├── TeacherBody.jsx          # Layout wrapper
│   │   ├── TeacherDashboard.jsx     # Teacher home / overview
│   │   ├── TeacherMarkAttendance.jsx  # Core attendance marking interface
│   │   ├── AddSubNEnrollStud.jsx    # Subject creation & student enrollment
│   │   ├── TeacherNavbar.jsx        # Teacher-specific navbar
│   │   ├── TeacherSidebar.jsx       # Teacher-specific sidebar
│   │   └── TeacherOnboard.jsx       # Teacher onboarding form
│   │
│   ├── StudentPages/                # Student dashboard & views
│   │   ├── StudentBody.jsx          # Layout wrapper
│   │   ├── StudentDashboard.jsx     # Student home / overview
│   │   ├── StudentAttendanceView.jsx  # Per-subject attendance records
│   │   ├── StudentNavbar.jsx        # Student-specific navbar
│   │   ├── StudentSidebar.jsx       # Student-specific sidebar
│   │   └── StudentOnboard.jsx       # Student onboarding form
│   │
│   ├── components/                  # Shared / reusable components
│   │   ├── Navbar.jsx               # Shared top navigation bar
│   │   ├── Sidebar.jsx              # Shared sidebar navigation
│   │   ├── AddUser.jsx              # Modal for college admin to add users
│   │   ├── PhotoCrop.jsx            # Image cropping component (profile pictures)
│   │   ├── TagInput.jsx             # Tag-style multi-value input
│   │   └── ThemeSelector.jsx        # DaisyUI theme toggle
│   │
│   ├── hooks/                       # Custom React hooks
│   ├── constants/                   # App-wide constants
│   ├── lib/                         # Utility libraries
│   ├── utils/                       # Helper functions
│   └── Images/                      # Static image assets
│
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # TailwindCSS + DaisyUI config
├── postcss.config.js                # PostCSS config
├── eslint.config.js                 # ESLint configuration
├── .env                             # Environment variables (not committed)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- The [backend](../backend/README.md) server running locally

### Installation

```bash
cd frontend/Scan2Attend
npm install
```

### Environment Variables

Create a `.env` file in `frontend/Scan2Attend/`:

```env
VITE_BACKEND_URL=http://localhost:3001/api
VITE_FRONTEND_URL=http://localhost:5173
```

### Running

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

The app runs at **http://localhost:5173**.

---

## 🗺️ Routing & Navigation

### Route Map

| Path | Component | Auth | Role | Description |
|------|-----------|:----:|------|-------------|
| `/` | `LoginPage` | ✗ | — | Login or redirect to role dashboard |
| `/signup` | `SignUpPage` | ✗ | — | User registration |
| `/otp` | `OtpPage` | ✗ | — | OTP verification |
| `/login/forgot-password` | `ForgotPasswordPage` | ✗ | — | Request password reset |
| `/login/reset-password` | `NewPasswordPage` | ✗ | — | Set new password |
| `/student/onboard` | `StudentOnboard` | ✓ | student | Student profile setup |
| `/student` | `StudentDashboard` | ✓ | student | Student home |
| `/student/attendance-view` | `StudentAttendanceView` | ✓ | student | View attendance records |
| `/teacher/onboard` | `TeacherOnboard` | ✓ | teacher | Teacher profile setup |
| `/teacher` | `TeacherDashboard` | ✓ | teacher | Teacher home |
| `/teacher/addNenroll` | `AddSubNEnrollStud` | ✓ | teacher | Subject & enrollment management |
| `/teacher/attendance-mark` | `TeacherMarkAttendance` | ✓ | teacher | Mark student attendance |
| `/college/onboard` | `CollegeOnboard` | ✓ | college | College profile setup |
| `/college` | `CollegeHome` | ✓ | college | College admin dashboard |

### Route Guard Logic

```
User visits "/" →
  ├── Not authenticated → Show LoginPage
  └── Authenticated →
        ├── Student →  Onboarded? → /student      | /student/onboard
        ├── Teacher →  Onboarded? → /teacher      | /teacher/onboard
        └── College →  Onboarded? → /college      | /college/onboard
```

---

## 🧠 State Management (Redux)

| Slice | Key State | Persistence | Purpose |
|-------|-----------|:-----------:|---------|
| **authSlice** | `isAuthenticated`, `isRole`, `isOnboarded` | `localStorage` | Drives route guards & auth status |
| **userSlice** | `userData` | `localStorage` | Current user profile data |
| **themeSlice** | `currentTheme` | `localStorage` | DaisyUI theme (light/dark/etc.) |

All slices load initial state from `localStorage` on app boot via `loadAuth()` and `loadUser()` dispatched in `App.jsx`.

---

## 🎨 Styling

- **TailwindCSS** — utility-first styling
- **DaisyUI** — component classes + theme system (`data-theme` attribute)
- **MUI v7** — Material Design components (`@emotion/react` + `@emotion/styled`)
- Theme is toggled via `ThemeSelector` component and persisted in Redux + localStorage

---

## 📦 Key Dependencies

### Runtime

| Package | Usage |
|---------|-------|
| `react`, `react-dom` | Core React |
| `react-router-dom` | Routing |
| `@reduxjs/toolkit`, `react-redux` | State management |
| `axios` | HTTP requests to backend API |
| `@mui/material` | Material UI components |
| `lucide-react`, `react-icons` | Icons |
| `@tanstack/react-table` | Data tables |
| `ag-grid-react` | Advanced data grids |
| `react-hot-toast` | Toast notifications |
| `react-easy-crop` | Profile picture cropping |
| `react-otp-input` | OTP input field |
| `react-pro-sidebar` | Sidebar navigation |

### Dev

| Package | Usage |
|---------|-------|
| `vite` | Build tool |
| `@vitejs/plugin-react` | React support for Vite |
| `tailwindcss`, `postcss`, `autoprefixer` | CSS processing |
| `daisyui` | TailwindCSS component plugin |
| `eslint` | Linting |

---

## 👤 Author

**Amandeep Singh**

---

## 📄 License

[ISC](https://opensource.org/licenses/ISC)
