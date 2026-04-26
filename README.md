# 💎 Ridho Robbi Pasi - Premium Portfolio CMS

Modern, secure, and performant portfolio CMS built with Next.js 14 and Supabase.

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.13-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Features

### 🎨 **Frontend**

- ⚡ Next.js 14 with App Router & Server Components
- 🎭 Tailwind CSS 4.0 for styling
- 🌓 Dark/Light mode with smooth transitions
- 📱 Fully responsive design
- 🖼️ Optimized images with Next.js Image
- ⏳ Loading skeletons for better UX
- 🎯 SEO optimized with metadata

### 🔐 **Security**

- 🛡️ Middleware authentication for admin routes
- 🔒 Row Level Security (RLS) policies
- 🚫 Protected API endpoints
- ✅ Input validation & sanitization

### ⚡ **Performance**

- 🚀 Server-side rendering (SSR)
- 💾 Client-side caching strategy
- 🖼️ Image optimization & lazy loading
- 📦 Code splitting & tree shaking
- ⚡ Fast page loads (Lighthouse 90+)

### 🎛️ **Admin Dashboard**

- 📊 Real-time statistics
- 👁️ Visibility toggle (The Eye feature)
- 📝 CRUD operations for all content
- 📸 Multi-photo upload
- 💬 Message inbox with unread counter
- 📤 Export/backup data to JSON
- ⚙️ Site settings management

### 📊 **Content Management**

- 👤 Profile & About
- 💼 Projects portfolio
- 📝 Blog articles
- 🎓 Education timeline
- 💼 Work experience
- 🏆 Awards & achievements
- 📚 Publications
- 🏢 Organizations
- 🖼️ Photo gallery
- 💬 Contact messages

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone repository**

```bash
git clone https://github.com/yourusername/portfolio-cms.git
cd portfolio-cms
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. **Run database migrations**

Go to Supabase Dashboard → SQL Editor, then run:

- `supabase/migrations/001_standardize_columns.sql`
- `supabase/migrations/002_setup_rls_policies.sql`

5. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── blog/              # Blog pages
│   ├── projects/          # Projects pages
│   ├── login/             # Login page
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Home page
├── components/            # React components
│   ├── AdminSidebar.jsx   # Admin navigation
│   ├── ErrorBoundary.jsx  # Error handling
│   ├── OptimizedImage.jsx # Image optimization
│   ├── LoadingSkeleton.jsx # Loading states
│   ├── ExportData.jsx     # Data export
│   └── ...
├── utils/                 # Utility functions
│   ├── supabase/          # Supabase clients
│   ├── cache.js           # Caching strategy
│   ├── errorHandler.js    # Error handling
│   └── imageOptimizer.js  # Image utilities
├── supabase/              # Database migrations
│   └── migrations/
├── middleware.js          # Auth middleware
└── next.config.mjs        # Next.js config
```

---

## 🗄️ Database Schema

### Core Tables

| Table          | Description           | Key Columns                             |
| -------------- | --------------------- | --------------------------------------- |
| `Profile`      | User profile data     | name, bio, images, social links         |
| `Project`      | Portfolio projects    | title, description, images, showOnHome  |
| `Article`      | Blog posts            | title, content, slug, showOnHome        |
| `Experience`   | Work history          | company, position, period, showOnHome   |
| `Education`    | Education history     | institution, degree, period, showOnHome |
| `Skill`        | Skills & expertise    | name, category, level, showOnHome       |
| `Award`        | Awards & achievements | title, organizer, date, showOnHome      |
| `Publication`  | Publications          | title, outlet, date, showOnHome         |
| `Organization` | Organizations         | name, role, period, showOnHome          |
| `Gallery`      | Photo gallery         | title, images, category, showOnHome     |
| `Message`      | Contact messages      | name, email, message, isRead            |
| `SiteSettings` | Site configuration    | key, value                              |

---

## 🔧 Configuration

### Environment Variables

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Next.js Config

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['uuybelgxovlgozgizith.supabase.co'],
  },
};
```

---

## 🎯 Key Features Explained

### 1. The Eye Feature (Visibility Toggle)

Quick show/hide content on home page without editing:

```jsx
// Usage in admin pages
<VisibilityToggle table="Project" id={project.id} currentStatus={project.showOnHome} />
```

### 2. Image Optimization

Automatic image optimization with loading states:

```jsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage src={imageUrl} alt="Description" width={800} height={600} priority={false} />;
```

### 3. Caching Strategy

Client-side caching to reduce database queries:

```javascript
import { fetchWithCache, CACHE_DURATION } from '@/utils/cache';

const data = await fetchWithCache(
  'Project',
  () => supabase.from('Project').select('*'),
  {},
  CACHE_DURATION.MEDIUM
);
```

### 4. Error Handling

Centralized error handling:

```javascript
import { handleSupabaseError, logError } from '@/utils/errorHandler';

try {
  // Your code
} catch (error) {
  const appError = handleSupabaseError(error);
  logError(appError, { context: 'ProjectForm' });
}
```

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git push origin main
```

2. **Import to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your repository
- Add environment variables
- Deploy!

3. **Configure Domain** (Optional)

- Add custom domain in Vercel settings
- Update DNS records

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GA_ID` (optional)

---

## 📊 Performance

### Lighthouse Scores

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Optimization Techniques

- ✅ Server-side rendering
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Caching strategy
- ✅ Minification
- ✅ Compression

---

## 🔒 Security

### Authentication

- Supabase Auth for admin login
- Middleware protection for admin routes
- Session management with cookies

### Database Security

- Row Level Security (RLS) enabled
- Public read, authenticated write
- Proper policy configuration

### Best Practices

- Input validation
- XSS protection
- CSRF protection
- Secure headers

---

## 📚 Documentation

- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration instructions
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Detailed documentation

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### Tech Stack

- **Framework**: Next.js 14.2.13
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 4.0
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Fonts**: Outfit, Plus Jakarta Sans

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**Ridho Robbi Pasi**

- Website: [ridhorobbipasi.my.id](https://ridhorobbipasi.my.id)
- GitHub: [@ridhorobbipasi](https://github.com/ridhorobbipasi)
- LinkedIn: [Ridho Robbi Pasi](https://linkedin.com/in/ridhorobbipasi)

---

## 🙏 Acknowledgments

- Next.js team for amazing framework
- Supabase for backend infrastructure
- Vercel for hosting platform
- Lucide for beautiful icons
- Tailwind CSS for styling system

---

## 📞 Support

Need help?

- 📧 Email: contact@ridhorobbipasi.my.id
- 💬 Open an issue on GitHub
- 📖 Check documentation files

---

**Made with ❤️ by Ridho Robbi Pasi**

_Last Updated: April 26, 2026_
