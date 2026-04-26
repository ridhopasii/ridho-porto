# 🏗️ ARCHITECTURE OVERVIEW

Dokumentasi arsitektur lengkap Portfolio CMS v1.2.0

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │  Next.js App │  │   React      │      │
│  │   (User)     │──│   Router     │──│  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                            ▼                                 │
│                  ┌──────────────────┐                        │
│                  │  Middleware.js   │                        │
│                  │  (Auth Check)    │                        │
│                  └──────────────────┘                        │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Server     │  │   API        │  │   Utils      │      │
│  │  Components  │  │   Routes     │  │  (Cache,     │      │
│  │              │  │              │  │   Error)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │      │
│  │  (Database)  │  │   (Users)    │  │   (Images)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                  ┌──────────────────┐                        │
│                  │   RLS Policies   │                        │
│                  │   (Security)     │                        │
│                  └──────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Public User Flow (Home Page)

```
User Request
    │
    ▼
Middleware (Pass - Public Route)
    │
    ▼
Server Component (app/page.jsx)
    │
    ▼
Supabase Client (Server)
    │
    ▼
Database Query (with RLS - Public Read)
    │
    ▼
Cache Check (utils/cache.js)
    │
    ├─ Cache Hit → Return Cached Data
    │
    └─ Cache Miss → Fetch from DB → Store in Cache
    │
    ▼
Render Components
    │
    ▼
Send HTML to Browser
```

### 2. Admin User Flow (Dashboard)

```
Admin Request (/admin/*)
    │
    ▼
Middleware (Auth Check)
    │
    ├─ Not Authenticated → Redirect to /login
    │
    └─ Authenticated → Continue
        │
        ▼
    Server Component (app/admin/page.jsx)
        │
        ▼
    Supabase Client (Server) with Auth Token
        │
        ▼
    Database Query (with RLS - Authenticated Write)
        │
        ▼
    Render Admin Dashboard
        │
        ▼
    Send HTML to Browser
```

### 3. Form Submission Flow (Contact Form)

```
User Fills Form
    │
    ▼
Client Component (ContactForm.jsx)
    │
    ▼
Form Validation
    │
    ▼
Supabase Client (Browser)
    │
    ▼
Database Insert (with RLS - Public Insert)
    │
    ▼
Success/Error Handling (ErrorBoundary)
    │
    ▼
Show Feedback to User
    │
    ▼
Real-time Update (Supabase Realtime)
    │
    ▼
Admin Sidebar Updates Unread Count
```

---

## 🗂️ Component Hierarchy

```
app/layout.jsx (Root)
│
├─ ErrorBoundary
│  │
│  └─ ThemeProvider
│     │
│     ├─ Analytics
│     │
│     └─ {children}
│        │
│        ├─ Public Pages
│        │  │
│        │  ├─ Navbar
│        │  ├─ Hero
│        │  ├─ About
│        │  ├─ Projects
│        │  ├─ Skills
│        │  ├─ Timeline
│        │  ├─ Gallery
│        │  └─ ContactForm
│        │
│        └─ Admin Pages
│           │
│           ├─ AdminSidebar
│           │
│           └─ Admin Content
│              │
│              ├─ Dashboard
│              ├─ ProfileForm
│              ├─ ProjectForm
│              ├─ BlogForm
│              ├─ MessageList
│              └─ Settings
│                 │
│                 └─ ExportData
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Layer 1: Middleware             │
│  - Check authentication                 │
│  - Redirect if not logged in            │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│    Layer 2: Supabase Auth               │
│  - JWT token validation                 │
│  - Session management                   │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│    Layer 3: RLS Policies                │
│  - Row-level security                   │
│  - Public read, auth write              │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│    Layer 4: Input Validation            │
│  - Form validation                      │
│  - Type checking                        │
└─────────────────────────────────────────┘
```

---

## ⚡ Performance Optimization

### 1. Caching Strategy

```
Request → Cache Check
           │
           ├─ HIT → Return Cached (Fast)
           │
           └─ MISS → Fetch from DB
                      │
                      └─ Store in Cache
                         │
                         └─ Return Data
```

**Cache Levels**:

- SHORT: 5 minutes (dynamic data)
- MEDIUM: 15 minutes (semi-static)
- LONG: 60 minutes (static data)

### 2. Image Loading

```
Image Request
    │
    ▼
OptimizedImage Component
    │
    ├─ Show Skeleton
    │
    ├─ Load Image (lazy)
    │
    ├─ Compress if needed
    │
    └─ Show Image with fade-in
```

### 3. Code Splitting

```
Route Request
    │
    ▼
Next.js Router
    │
    ├─ Load only required chunks
    │
    ├─ Prefetch on hover
    │
    └─ Dynamic imports for heavy components
```

---

## 🗄️ Database Schema

```
┌─────────────┐
│   Profile   │ (1 row - site owner)
└─────────────┘
       │
       │ has many
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Project   │     │   Article   │     │    Skill    │
│ showOnHome  │     │ showOnHome  │     │ showOnHome  │
└─────────────┘     └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Experience  │     │  Education  │     │    Award    │
│ showOnHome  │     │ showOnHome  │     │ showOnHome  │
└─────────────┘     └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│Publication  │     │Organization │     │   Gallery   │
│ showOnHome  │     │ showOnHome  │     │ showOnHome  │
└─────────────┘     └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐
│   Message   │     │SiteSettings │
│   isRead    │     │  key/value  │
└─────────────┘     └─────────────┘
```

**Common Columns**:

- `id` - Primary key
- `showOnHome` - Visibility toggle
- `createdAt` - Timestamp
- `updatedAt` - Timestamp
- `images` - JSONB array

---

## 🔄 State Management

```
┌─────────────────────────────────────────┐
│         Server State (Supabase)         │
│  - Database data                        │
│  - Auth state                           │
│  - Real-time subscriptions              │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Client State (React)            │
│  - Form state (useState)                │
│  - UI state (loading, errors)           │
│  - Theme state (Context)                │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Cache State (Memory)            │
│  - Cached queries                       │
│  - TTL management                       │
└─────────────────────────────────────────┘
```

---

## 🎨 Styling Architecture

```
Tailwind CSS (Utility-first)
    │
    ├─ globals.css (Base styles)
    │
    ├─ Component styles (Inline classes)
    │
    └─ Custom utilities (Extended config)
```

**Design System**:

- Primary: Teal (#14b8a6)
- Background: Dark (#0a0a0a)
- Text: White/Gray
- Fonts: Outfit (headings), Jakarta Sans (body)

---

## 📦 Build & Deploy

```
Development
    │
    ├─ npm run dev
    │  └─ Hot reload
    │
    ▼
Production Build
    │
    ├─ npm run build
    │  │
    │  ├─ Compile TypeScript
    │  ├─ Optimize images
    │  ├─ Bundle JavaScript
    │  ├─ Generate static pages
    │  └─ Create .next folder
    │
    ▼
Deploy to Vercel
    │
    ├─ Git push
    │  └─ Auto deploy
    │
    └─ Manual deploy
       └─ vercel --prod
```

---

## 🔍 Monitoring & Analytics

```
User Action
    │
    ▼
Analytics Component
    │
    ├─ Track page view
    ├─ Track events
    └─ Track errors
    │
    ▼
Google Analytics (Optional)
    │
    └─ Dashboard & Reports
```

---

## 🛠️ Development Workflow

```
1. Local Development
   └─ npm run dev

2. Make Changes
   └─ Edit files

3. Test Locally
   └─ Check browser

4. Commit Changes
   └─ git commit

5. Push to GitHub
   └─ git push

6. Auto Deploy
   └─ Vercel builds & deploys

7. Monitor
   └─ Check logs & analytics
```

---

## 📊 Performance Metrics

**Target Metrics**:

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

**Optimization Techniques**:

- ✅ Server-side rendering
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Caching
- ✅ Compression

---

## 🔐 Security Checklist

- ✅ Middleware authentication
- ✅ RLS policies enabled
- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure headers
- ✅ Environment variables
- ✅ No sensitive data in client

---

## 📚 Technology Stack

**Frontend**:

- Next.js 14.2.13
- React 18.3.1
- Tailwind CSS 4.0
- Lucide React

**Backend**:

- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Storage
- Supabase Realtime

**Deployment**:

- Vercel (Hosting)
- GitHub (Version Control)

**Tools**:

- ESLint (Linting)
- Prettier (Formatting)

---

_Architecture designed for scalability, security, and performance._
