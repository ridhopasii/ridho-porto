import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { BookOpen, ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function BlogsPage() {
  const supabase = await createClient();
  const { data: blogs } = await supabase
    .from('Article')
    .select('*')
    .not('showOnHome', 'eq', false)
    .order('createdAt', { ascending: false });

  return (
    <div className="min-h-screen bg-background text-foreground font-jakarta selection:bg-orange-500/30">
      <Navbar />

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-orange-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Beranda
          </Link>

          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none">
            Tech{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
              Insights.
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
            Berbagi pemikiran, tutorial, dan pengalaman seputar dunia pengembangan web dan
            teknologi.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {blogs?.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug || blog.id}`}
              className="group block p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] hover:border-orange-500/30 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-full md:w-48 aspect-square rounded-3xl overflow-hidden flex-shrink-0 border border-[var(--border-subtle)]">
                  <img
                    src={blog.image || 'https://via.placeholder.com/400x400?text=Blog'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {blog.category || 'Article'}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-bold uppercase tracking-widest">
                      <Clock size={12} />{' '}
                      {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black font-outfit uppercase mb-4 group-hover:text-orange-400 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-2 font-medium">
                    {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                  </p>

                  <div className="flex items-center gap-2 text-orange-500 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                    Baca Selengkapnya <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {blogs?.length === 0 && (
            <div className="text-center py-20 p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[3rem]">
              <p className="text-gray-500 italic">Belum ada artikel yang dipublikasikan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
