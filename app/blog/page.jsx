import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { Calendar, ArrowRight, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogListing() {
  const supabase = await createClient();

  const { data: blogs } = await supabase
    .from('Article')
    .select('*')
    .eq('published', true)
    .order('createdAt', { ascending: false });

  const categories = [...new Set((blogs || []).map((b) => b.category).filter(Boolean))];

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-teal-500/3 blur-[200px] rounded-full top-0"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <BookOpen size={14} className="text-teal-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-500">
              Journal & Writings
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-outfit mb-6 uppercase tracking-tighter leading-none">
            Thoughts & <span className="text-teal-500">Insights</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Berbagi wawasan tentang pengembangan web, teknologi, dan perjalanan saya sebagai
            profesional muda.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Category Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-16 justify-center">
              <span className="px-6 py-2 bg-teal-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                All
              </span>
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-6 py-2 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full hover:border-teal-500/30 hover:text-white transition-all cursor-pointer"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Blog Grid */}
          {!blogs || blogs.length === 0 ? (
            <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
              <BookOpen className="w-16 h-16 text-gray-800 mx-auto mb-6" />
              <p className="text-gray-600 font-black uppercase tracking-widest text-sm">
                Belum ada artikel yang dipublikasikan.
              </p>
              <p className="text-gray-700 text-xs mt-2">Tambahkan artikel melalui panel admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, idx) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-teal-500/30 transition-all duration-500 flex flex-col"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-teal-500/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    {blog.category && (
                      <div className="absolute top-5 left-5">
                        <span className="bg-teal-500 text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-teal-500/20">
                          {blog.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 mb-4 uppercase tracking-widest font-bold">
                      <Calendar size={11} className="text-teal-500" />
                      {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                      {blog.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                      {blog.excerpt || 'Klik untuk membaca artikel selengkapnya...'}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center text-teal-500 font-black text-[10px] uppercase tracking-widest group/btn">
                        Read Article
                        <ArrowRight
                          size={14}
                          className="ml-2 group-hover/btn:ml-4 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-16 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-700">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Writings & Insights
      </footer>
    </main>
  );
}
