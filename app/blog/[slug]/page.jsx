import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { Calendar, Tag, ArrowLeft, User, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BlogDetail({ params }) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: blog } = await supabase.from('Article').select('*').eq('slug', slug).single();

  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-500 transition-all mb-10 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Writings
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-teal-500/10 text-teal-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-teal-500/20">
                {blog.category || 'ARTICLE'}
              </span>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={14} className="text-teal-500/50" />
                {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-outfit leading-tight mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent uppercase tracking-tight">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between border-y border-white/5 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                  <User size={20} className="text-teal-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Ridho Robbi Pasi</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Author</p>
                </div>
              </div>
              <button className="p-2.5 bg-white/5 hover:bg-teal-500/20 hover:text-teal-400 rounded-full border border-white/10 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </header>

          {/* Cover Image */}
          {blog.imageUrl && (
            <div className="mb-12 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-auto" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-teal max-w-none">
            <div className="text-gray-300 leading-relaxed text-lg space-y-6 whitespace-pre-wrap font-jakarta">
              {blog.content}
            </div>
          </div>

          {/* Footer Card */}
          <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/5 text-center">
            <h3 className="text-xl font-bold mb-4">Terima kasih telah membaca!</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Jika Anda menyukai artikel ini atau memiliki pertanyaan, jangan ragu untuk berdiskusi
              dengan saya melalui halaman kontak.
            </p>
            <Link
              href="/#contact"
              className="inline-block bg-teal-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
