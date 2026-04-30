import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import ReadingProgress from '@/components/ReadingProgress';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import Link from 'next/link';

// DYNAMIC SEO METADATA
export async function generateMetadata({ params }) {
  const supabase = await createClient();
  const { slug } = params;
  const { data: blog } = await supabase.from('Article').select('*').eq('slug', slug).single();
  
  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: blog.title,
    description: blog.content?.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content?.substring(0, 160),
      images: [blog.image || ''],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const supabase = await createClient();
  const { slug } = params;

  const { data: blog } = await supabase.from('Article').select('*').eq('slug', slug).single();

  if (!blog) return <div className="p-20 text-center">Blog not found.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground font-jakarta selection:bg-[var(--accent)]/30">
      <ReadingProgress />
      <Navbar />

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-[var(--accent)]/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-12 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Kembali ke Blog
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <span className="px-4 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              {blog.category || 'Technology'}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} />{' '}
              {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black font-outfit uppercase tracking-tight leading-tight mb-12">
            {blog.title}
          </h1>

          <div className="relative w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-[var(--border-subtle)] mb-16">
            <Image
              src={blog.image || 'https://via.placeholder.com/1200x600'}
              alt={blog.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Article Content with Markdown Support */}
          <div className="max-w-none">
            <MarkdownRenderer content={blog.content} />
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
          Terima kasih telah membaca.
        </p>
      </footer>
    </div>
  );
}
