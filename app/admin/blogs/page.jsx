'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Pencil, Trash2, BookOpen, Loader2 } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import Link from 'next/link'

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setBlogs(data)
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return

    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (!error) {
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Blog Posts</h1>
              <p className="text-gray-400">Bagikan pemikiran dan tutorial Anda</p>
            </div>
            <Link 
              href="/admin/blogs/new"
              className="bg-accent hover:bg-accent text-foreground px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Tulis Artikel
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {blogs.length === 0 ? (
                <div className="bg-[#1a1a1a] p-12 rounded-2xl border border-white/5 text-center">
                  <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Belum ada artikel. Ayo mulai menulis!</p>
                </div>
              ) : (
                blogs.map((blog) => (
                  <div 
                    key={blog.id}
                    className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-[var(--border-subtle)] transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      {blog.cover_image && (
                        <img 
                          src={blog.cover_image} 
                          alt={blog.title}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{blog.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-xs">
                            {blog.category || 'Uncategorized'}
                          </span>
                          <span>•</span>
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Link 
                        href={`/admin/blogs/edit/${blog.id}`}
                        className="p-2 text-gray-400 hover:text-foreground hover:bg-white/5 rounded-lg transition-all"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
