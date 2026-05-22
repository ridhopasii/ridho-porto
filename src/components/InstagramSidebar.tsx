import { useEffect, useState } from 'react';
import { fetchInstagramFeed, type InstagramPost } from '@/lib/instagram';
import { Instagram, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstagramSidebar() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      // Fetch 6 posts for the sidebar
      const data = await fetchInstagramFeed(6);
      setPosts(data);
      setIsLoading(false);
    }
    loadFeed();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl border border-border bg-card animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show if there's no data
  }

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center">
          <Instagram size={16} className="text-white" />
        </div>
        <h3 className="font-semibold text-sm">Instagram Feed</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {posts.slice(0, 4).map((post, i) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-md overflow-hidden bg-muted block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <img 
              src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url} 
              alt={post.caption || 'Instagram Post'} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <ExternalLink className="text-white" size={16} />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
