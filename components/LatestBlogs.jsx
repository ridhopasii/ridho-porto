'use client';
import Link from 'next/link';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

export default function LatestBlogs({ blogs }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-bold text-teal-500 uppercase tracking-[0.3em] mb-3">
              Journal
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold font-outfit text-white">
              Latest Thoughts
            </h3>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-all font-medium"
          >
            Lihat Semua Artikel
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-teal-500/30 transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
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
                <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-4 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Calendar size={12} className="text-teal-500" />
                    {new Date(blog.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h3>

                <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {blog.excerpt || 'Klik untuk membaca artikel selengkapnya...'}
                </p>

                <div className="mt-auto flex items-center text-teal-500 font-bold text-xs uppercase tracking-widest group/btn">
                  Read Article
                  <ArrowRight size={14} className="ml-2 group-hover/btn:ml-4 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 md:hidden text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-teal-500 font-bold">
            Lihat Semua Artikel
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
