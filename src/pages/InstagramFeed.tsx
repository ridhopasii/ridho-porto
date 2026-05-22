import { useEffect, useState } from 'react';
import { fetchInstagramFeed, type InstagramPost } from '@/lib/instagram';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      // Fetch up to 12 posts for the dedicated page
      const data = await fetchInstagramFeed(12);
      setPosts(data);
      setIsLoading(false);
    }
    loadFeed();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="space-y-8 pb-16">
      <motion.div {...fadeInUp} className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center mb-4">
          <Instagram size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Instagram Feed</h1>
        <p className="text-muted-foreground max-w-md">
          Galeri foto dan video terbaru langsung dari Instagram saya.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img 
                  src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url} 
                  alt={post.caption || 'Instagram Post'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {post.media_type === 'VIDEO' && (
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider">
                    VIDEO
                  </div>
                )}
                {post.media_type === 'CAROUSEL_ALBUM' && (
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider">
                    CAROUSEL
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                  <div className="flex items-center gap-4 text-white">
                    <span className="flex items-center gap-1.5 font-medium"><Heart size={20} /> Like</span>
                    <span className="flex items-center gap-1.5 font-medium"><MessageCircle size={20} /> Comment</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
                    View on Instagram <ExternalLink size={14} />
                  </div>
                </div>
              </div>
              {post.caption && (
                <div className="p-4">
                  <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(post.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </motion.a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">Belum ada postingan yang bisa ditampilkan atau token API tidak valid.</p>
        </div>
      )}
    </div>
  );
}
