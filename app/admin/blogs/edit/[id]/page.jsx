'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import AdminSidebar from '@/components/AdminSidebar'
import BlogForm from '@/components/BlogForm'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function EditBlog() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) setBlog(data)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
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
          <h1 className="text-3xl font-bold text-foreground mb-8">Edit Artikel</h1>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : blog ? (
            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 shadow-2xl">
              <BlogForm initialData={blog} />
            </div>
          ) : (
            <div className="text-center text-gray-400">Artikel tidak ditemukan.</div>
          )}
        </div>
      </main>
    </div>
  )
}
