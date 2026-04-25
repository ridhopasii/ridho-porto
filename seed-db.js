import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ URL atau Service Role Key tidak ditemukan!')
  process.exit(1)
}

// Gunakan Service Role Key untuk melewati RLS
const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seed() {
  console.log('🚀 Memulai pengisian data dengan izin penuh (Service Role)...')

  // 1. Insert Profile
  const { error: pError } = await supabase
    .from('Profile')
    .insert({
      fullName: 'Ridho Robbi Pasii',
      title: 'Full Stack Web Developer',
      bio: 'Seorang pengembang web yang antusias membangun aplikasi modern dan estetis.',
      avatarUrl: 'https://github.com/ridhopasii.png',
      location: 'Indonesia',
    })

  if (pError) console.error('❌ Profile Error:', pError.message)
  else console.log('✅ Profile berhasil dimasukkan!')

  // 2. Insert Socials
  const { error: sError } = await supabase
    .from('Social')
    .insert([
      { platform: 'GitHub', url: 'https://github.com/ridhopasii', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/ridhopasii', icon: 'linkedin' },
    ])

  if (sError) console.error('❌ Social Error:', sError.message)
  else console.log('✅ Social Media berhasil dimasukkan!')

  console.log('\n✨ SEMUA BERHASIL! Silakan refresh halaman: http://localhost:3000/test-db')
}

seed()
