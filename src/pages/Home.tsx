import { NavLink } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import {
  Download,
  ArrowRight,
  Github,
  Linkedin,
  MessageCircle,
  MapPin,
  Mail,
  Heart,
  MessageSquare,
  Eye,
} from 'lucide-react';
import InstagramSidebar from '@/components/InstagramSidebar';

export default function Home() {
  const { data } = useData();
  const { profile, blogPosts, techStacks, recommendations } = data;

  const recentBlogs = blogPosts.slice(0, 3);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="space-y-16 pb-16">
      {/* About Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start gap-8"
        >
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-border"
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.title}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              {profile.bio}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={14} />
                {profile.email}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white text-sm font-medium transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a
                href={profile.resumeUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors"
              >
                <Download size={16} />
                Download Resume
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Recent Blogs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Blogs</h2>
          <NavLink
            to="/blogs"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight size={14} />
          </NavLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBlogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <NavLink to="/blogs">
                <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-muted">
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
                <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
              </NavLink>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Instagram Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Social Feed</h2>
          <NavLink
            to="/socials"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            View Instagram
            <ArrowRight size={14} />
          </NavLink>
        </div>
        <InstagramSidebar />
      </section>

      {/* Tech Stacks Section */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Tech Stacks</h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {techStacks.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors cursor-default"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Recommendations Section */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={rec.avatar}
                  alt={rec.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{rec.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {rec.role} at {rec.company}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rec.content}
              </p>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: rec.rating }).map((_, i) => (
                  <Heart key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-muted/30 p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl font-bold mb-3">Have any project ideas?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <NavLink
              to="/contacts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail size={16} />
              Contact Me
            </NavLink>
            <NavLink
              to="/chats"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors"
            >
              <MessageCircle size={16} />
              Guestbook
            </NavLink>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
