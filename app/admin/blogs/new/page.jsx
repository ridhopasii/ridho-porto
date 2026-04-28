import AdminSidebar from '@/components/AdminSidebar'
import BlogForm from '@/components/BlogForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewBlog() {
  return (
    <div className="flex min-h-screen bg-body">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/admin/blogs"
            className="flex items-center gap-2 text-gray-400 hover:text-foreground transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-8">Tulis Artikel Baru</h1>
          <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[var(--border-subtle)] shadow-2xl">
            <BlogForm />
          </div>
        </div>
      </main>
    </div>
  )
}
