import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Eye, Clock } from 'lucide-react';
import { useState } from 'react';

type TabType = 'all' | 'featured';

export default function Blogs() {
  const { data } = useData();
  const { blogPosts } = data;
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const featuredBlog = blogPosts.find((b) => b.featured);
  const recentBlogs =
    activeTab === 'all'
      ? blogPosts.filter((b) => !b.featured)
      : blogPosts;

  return (
    <div className="space-y-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">Blogs</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Thoughts, tutorials, and insights about technology.
        </p>

        {/* Featured Blog */}
        {featuredBlog && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group cursor-pointer mb-8"
          >
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={featuredBlog.image}
                alt={featuredBlog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={featuredBlog.authorAvatar}
                alt={featuredBlog.author}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{featuredBlog.author}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{featuredBlog.date}</span>
              <span className="text-muted-foreground">·</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                {featuredBlog.readTime}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
              {featuredBlog.title}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-2xl">{featuredBlog.excerpt}</p>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {featuredBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {featuredBlog.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {featuredBlog.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={14} />
                  {featuredBlog.reactions}
                </span>
              </div>
            </div>
          </motion.article>
        )}

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 p-1 rounded-xl bg-muted w-fit">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Recent Blogs
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'featured'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Posts
            </button>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBlogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-3">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex gap-2 mb-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {blog.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{blog.date}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {blog.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  {blog.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={12} />
                  {blog.reactions}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
