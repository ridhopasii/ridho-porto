# 🚀 MIGRATION GUIDE - Version 1.2.0

Panduan lengkap untuk mengupdate proyek dari versi sebelumnya ke v1.2.0.

---

## 📋 Pre-Migration Checklist

- [ ] Backup database Anda (gunakan Export Data feature atau Supabase backup)
- [ ] Commit semua perubahan ke Git
- [ ] Test di local environment terlebih dahulu
- [ ] Pastikan Supabase credentials sudah benar di `.env.local`

---

## 🔄 Step-by-Step Migration

### Step 1: Update Codebase

```bash
# Pull latest changes
git pull origin main

# Install dependencies (jika ada yang baru)
npm install
```

### Step 2: Run Database Migrations

#### Option A: Via Supabase Dashboard (Recommended)

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka **SQL Editor**
4. Copy-paste dan jalankan file berikut secara berurutan:

**Migration 1: Standardize Columns**

```sql
-- Copy dari: supabase/migrations/001_standardize_columns.sql
-- Paste ke SQL Editor dan klik "Run"
```

**Migration 2: Setup RLS Policies**

```sql
-- Copy dari: supabase/migrations/002_setup_rls_policies.sql
-- Paste ke SQL Editor dan klik "Run"
```

#### Option B: Via Supabase CLI

```bash
# Install Supabase CLI jika belum
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 3: Verify Database Changes

Jalankan query berikut untuk memastikan migration berhasil:

```sql
-- Check kolom showOnHome ada di semua tabel
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE column_name = 'showOnHome'
  AND table_schema = 'public';

-- Expected result: 9 rows (Project, Article, Experience, Education, Skill, Award, Publication, Organization, Gallery)

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Expected: Multiple policies per table
```

### Step 4: Update Environment Variables (Optional)

Tambahkan ke `.env.local` jika ingin menggunakan Google Analytics:

```env
# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 5: Test Locally

```bash
# Run development server
npm run dev

# Test:
# 1. Login ke /admin (harus redirect jika belum login)
# 2. Test visibility toggle (The Eye)
# 3. Test export data di Settings
# 4. Test theme toggle
# 5. Check console untuk errors
```

### Step 6: Deploy to Production

```bash
# Build untuk production
npm run build

# Test build locally
npm start

# Deploy ke Vercel
vercel --prod

# Atau push ke GitHub (jika auto-deploy enabled)
git push origin main
```

---

## 🔍 Post-Migration Verification

### 1. Check Authentication

- [ ] Visit `/admin` tanpa login → Should redirect to `/login`
- [ ] Login dengan credentials → Should access admin dashboard
- [ ] Logout → Should redirect to `/login`

### 2. Check Visibility Toggle

- [ ] Go to admin Projects page
- [ ] Click eye icon on a project
- [ ] Refresh home page → Project should disappear/appear
- [ ] Check other content types (Articles, Skills, etc.)

### 3. Check Export Feature

- [ ] Go to `/admin/settings`
- [ ] Scroll to Export Data section
- [ ] Click "Export Semua Data"
- [ ] Verify JSON file downloads
- [ ] Open JSON → Should contain all data

### 4. Check Error Handling

- [ ] Try accessing non-existent page → Should show error boundary
- [ ] Try submitting invalid form → Should show error message
- [ ] Check browser console → No critical errors

### 5. Check Performance

- [ ] Open DevTools → Network tab
- [ ] Reload page → Check image loading
- [ ] Images should load progressively with blur effect
- [ ] Check Lighthouse score (should be 90+)

---

## 🐛 Troubleshooting

### Issue: Migration SQL Fails

**Error**: `column "showOnHome" already exists`

**Solution**:

```sql
-- Skip yang error, lanjut ke migration berikutnya
-- Atau drop column dulu:
ALTER TABLE "Project" DROP COLUMN IF EXISTS "showOnHome";
-- Lalu run migration lagi
```

### Issue: RLS Policy Conflicts

**Error**: `policy "xxx" already exists`

**Solution**:

```sql
-- Drop existing policies dulu
DROP POLICY IF EXISTS "project_public_read" ON "Project";
-- Lalu run migration lagi
```

### Issue: Middleware Redirect Loop

**Error**: Infinite redirect antara `/admin` dan `/login`

**Solution**:

1. Check Supabase auth session di browser DevTools → Application → Cookies
2. Clear cookies dan login ulang
3. Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar

### Issue: Images Not Loading

**Error**: Images show placeholder icon

**Solution**:

1. Check `next.config.mjs` → `images.domains` includes Supabase domain
2. Verify image URLs di database
3. Check Supabase Storage permissions

### Issue: Theme Not Persisting

**Error**: Theme resets on page reload

**Solution**:

1. Check browser localStorage → Should have `theme` key
2. Clear cache dan reload
3. Check `ThemeProvider` is wrapping app in `layout.jsx`

---

## 📊 Data Migration Notes

### Article Table: `published` → `showOnHome`

Migration akan otomatis:

1. Create kolom `showOnHome`
2. Copy nilai dari `published` ke `showOnHome`
3. Drop kolom `published`

**Manual verification**:

```sql
-- Check data migrated correctly
SELECT id, title, showOnHome FROM "Article" LIMIT 10;
```

### Default Values

Semua existing data akan mendapat `showOnHome = true` by default.

Jika ada data yang ingin disembunyikan:

```sql
UPDATE "Project" SET "showOnHome" = false WHERE id = 123;
```

---

## 🔄 Rollback Plan

Jika terjadi masalah kritis, rollback dengan:

### 1. Rollback Code

```bash
git revert HEAD
git push origin main
```

### 2. Rollback Database (Manual)

```sql
-- Restore kolom published di Article
ALTER TABLE "Article" ADD COLUMN "published" BOOLEAN DEFAULT true;
UPDATE "Article" SET "published" = "showOnHome";

-- Drop kolom showOnHome jika perlu
ALTER TABLE "Project" DROP COLUMN "showOnHome";
ALTER TABLE "Article" DROP COLUMN "showOnHome";
-- ... dst untuk tabel lain

-- Drop RLS policies
DROP POLICY IF EXISTS "project_public_read" ON "Project";
-- ... dst untuk policy lain
```

### 3. Restore from Backup

Jika ada backup Supabase:

1. Go to Supabase Dashboard → Database → Backups
2. Select backup sebelum migration
3. Click "Restore"

---

## 📞 Support

Jika mengalami masalah:

1. Check error logs di:
   - Browser Console (F12)
   - Vercel Deployment Logs
   - Supabase Logs

2. Review dokumentasi:
   - `CHANGELOG.md` - List of changes
   - `DOCUMENTATION.md` - Project overview

3. Common issues biasanya terkait:
   - Environment variables tidak set
   - RLS policies blocking queries
   - Authentication session expired

---

**Migration completed successfully? ✅**

Selamat! Proyek Anda sekarang lebih secure, performant, dan maintainable.

---

_Last Updated: 2026-04-26_
