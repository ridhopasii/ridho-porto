'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

export default function LatestBlogs({ blogs }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em] mb-3">
              Insights
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold font-outfit text-foreground">
              Latest Thoughts
            </h3>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-accent transition-all font-medium"
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
              className="group card-premium overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {blog.imageUrl ? (
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-accent/20" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {blog.category || 'ARTICLE'}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Calendar size={12} className="text-accent" />
                    {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                  {blog.excerpt || 'Klik untuk membaca artikel selengkapnya...'}
                </p>

                <div className="mt-auto flex items-center text-accent font-bold text-xs uppercase tracking-widest group/btn">
                  Read Article
                  <ArrowRight size={14} className="ml-2 group-hover/btn:ml-4 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 md:hidden text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-accent font-bold">
            Lihat Semua Artikel
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
