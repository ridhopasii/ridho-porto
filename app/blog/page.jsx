'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Navbar from '@/components/Navbar'
import { Calendar, Tag, ArrowRight, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function BlogListing() {
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

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Writings & Thoughts
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Berbagi wawasan tentang pengembangan web, teknologi terbaru, dan perjalanan karir saya.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Belum ada artikel yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link 
                  key={blog.id} 
                  href={`/blog/${blog.slug}`}
                  className="group bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-teal-500/30 transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {blog.cover_image ? (
                      <img 
                        src={blog.cover_image} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-teal-500/10 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-teal-500/20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-teal-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        {blog.category || 'ARTICLE'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-teal-500" />
                        {new Date(blog.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-teal-400 transition-colors line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {blog.excerpt || 'Klik untuk membaca artikel selengkapnya...'}
                    </p>
                    
                    <div className="mt-auto flex items-center text-teal-500 font-semibold text-sm group/btn">
                      Read More
                      <ArrowRight size={16} className="ml-2 group-hover/btn:ml-4 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
