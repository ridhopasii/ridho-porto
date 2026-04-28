'use client';
import { useState, useEffect } from 'react';
import { Instagram, AlertCircle } from 'lucide-react';
import PhotoSwiper from './PhotoSwiper';

export default function InstagramFeed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInstagram() {
      try {
        const res = await fetch('/api/instagram');
        const data = await res.json();
        
        if (res.ok && data.data) {
          setFeed(data.data.slice(0, 6)); // Ambil 6 foto terbaru
        } else {
          throw new Error(data.error || 'Failed to fetch Instagram feed');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInstagram();
  }, []);

  return (
    <section className="py-24 px-6 bg-transparent border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12 animate-fade-in-up">
          <div className="p-3 bg-pink-500/10 text-pink-500 rounded-2xl">
            <Instagram size={28} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-outfit uppercase tracking-tight flex-1">
            Instagram <span className="text-pink-500">Feed</span>
          </h2>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            className="hidden md:inline-flex px-6 py-3 bg-white/5 border border-[var(--border-subtle)] rounded-full text-xs font-bold uppercase tracking-widest hover:border-pink-500 hover:text-pink-500 transition-colors"
          >
            Follow Me
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 border border-dashed border-[var(--border-subtle)] rounded-3xl text-center bg-white/5 flex flex-col items-center justify-center min-h-[300px]">
            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold mb-2">Instagram Belum Terhubung</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Sistem membutuhkan <strong>Instagram Basic Display Token</strong> di file <code>.env.local</code> Anda agar bisa menarik foto secara otomatis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {feed.map((post) => (
              <a 
                key={post.id} 
                href={post.permalink} 
                target="_blank" 
                className="group relative aspect-square rounded-2xl overflow-hidden bg-background border border-[var(--border-subtle)]"
              >
                <img 
                  src={post.media_url} 
                  alt={post.caption || 'Instagram Post'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <Instagram className="text-white w-6 h-6 mb-2" />
                  <p className="text-white text-xs line-clamp-2">{post.caption}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
