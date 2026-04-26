# ⚡ QUICK START GUIDE

Panduan cepat untuk memulai proyek Portfolio CMS.

---

## 🚀 Setup dalam 5 Menit

### 1️⃣ Clone & Install (1 menit)

```bash
git clone <your-repo-url>
cd portfolio-cms
npm install
```

### 2️⃣ Setup Supabase (2 menit)

1. Buat project di [supabase.com](https://supabase.com)
2. Copy credentials dari Settings → API
3. Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3️⃣ Run Migrations (1 menit)

Di Supabase Dashboard → SQL Editor, run:

```sql
-- Copy & paste dari:
-- 1. supabase/migrations/001_standardize_columns.sql
-- 2. supabase/migrations/002_setup_rls_policies.sql
```

### 4️⃣ Create Admin User (30 detik)

Di Supabase Dashboard → Authentication → Users → Add User:

- Email: admin@example.com
- Password: (your secure password)

### 5️⃣ Start Development (30 detik)

```bash
npm run dev
```

Open: http://localhost:3000

---

## 🎯 First Steps

### Login ke Admin

1. Go to: http://localhost:3000/login
2. Login dengan credentials Supabase
3. You're in! 🎉

### Add Your Profile

1. Go to: `/admin/profile`
2. Fill in your information
3. Upload photos
4. Save

### Add Your First Project

1. Go to: `/admin/projects`
2. Click "Tambah Proyek Baru"
3. Fill form & upload images
4. Publish

### Test Visibility Toggle

1. Go to any admin page (Projects, Articles, etc.)
2. Click the eye icon 👁️
3. Refresh home page
4. Content should appear/disappear

---

## 📁 Important Files

| File                 | Purpose                |
| -------------------- | ---------------------- |
| `app/page.jsx`       | Home page (main entry) |
| `app/admin/page.jsx` | Admin dashboard        |
| `middleware.js`      | Auth protection        |
| `.env.local`         | Environment variables  |
| `next.config.mjs`    | Next.js configuration  |

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Check code issues
npm run format           # Format code with Prettier
```

---

## 🐛 Quick Troubleshooting

### Can't Login?

**Check**:

1. Supabase credentials di `.env.local` benar?
2. User sudah dibuat di Supabase Auth?
3. Clear browser cookies & try again

### Images Not Loading?

**Check**:

1. `next.config.mjs` → `images.domains` includes Supabase domain
2. Image URLs di database valid
3. Supabase Storage bucket public

### Data Not Showing?

**Check**:

1. Migrations sudah dijalankan?
2. RLS policies sudah di-setup?
3. Data ada di database? (check Supabase Table Editor)

### Build Error?

**Check**:

1. All environment variables set?
2. Run `npm install` again
3. Delete `.next` folder & rebuild

---

## 📚 Learn More

- **Full Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Migration Guide**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)
- **Improvements**: [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md)

---

## 🎨 Customize

### Change Colors

Edit `app/globals.css`:

```css
/* Primary color (teal) */
--color-primary: #14b8a6;
```

### Change Fonts

Edit `app/layout.jsx`:

```javascript
import { YourFont } from 'next/font/google';
```

### Change Logo

Edit `components/Navbar.jsx` & `components/AdminSidebar.jsx`

---

## 🚀 Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repo
5. Add environment variables
6. Deploy! 🎉

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Environment Variables in Vercel

Add these in Vercel Dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ Checklist

Before going live:

- [ ] Profile filled
- [ ] At least 3 projects added
- [ ] At least 1 blog post
- [ ] Contact form tested
- [ ] All images optimized
- [ ] SEO metadata updated
- [ ] Custom domain configured
- [ ] Analytics setup (optional)
- [ ] Backup data exported

---

## 🎯 Key Features to Try

1. **The Eye** 👁️ - Toggle visibility on home page
2. **Export Data** 💾 - Backup all data to JSON
3. **Theme Toggle** 🌓 - Switch dark/light mode
4. **Real-time Messages** 💬 - See unread count update live
5. **Multi-photo Upload** 📸 - Upload multiple images at once

---

## 📞 Need Help?

- 📖 Read the docs (start with README.md)
- 🐛 Check troubleshooting section above
- 💬 Open GitHub issue
- 📧 Contact: contact@ridhorobbipasi.my.id

---

## 🎉 You're Ready!

Selamat! Proyek Anda sudah siap digunakan.

**Next**: Customize design, add content, dan deploy! 🚀

---

_Happy coding! 💻_
