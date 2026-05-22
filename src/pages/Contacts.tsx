import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Github, Linkedin, MessageCircle, Instagram, ExternalLink, Mail, MapPin } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Github,
  Linkedin,
  MessageCircle,
  Instagram,
};

export default function Contacts() {
  const { data } = useData();
  const { contacts, profile } = data;

  return (
    <div className="space-y-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">Contacts</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Get in touch with me through any of these platforms.
        </p>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {contacts.map((contact, index) => {
            const Icon = iconMap[contact.icon] || ExternalLink;
            return (
              <motion.a
                key={contact.id}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: contact.color + '15' }}
                >
                  <Icon size={24} style={{ color: contact.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{contact.platform}</p>
                  <p className="text-sm text-muted-foreground">{contact.username}</p>
                </div>
                <ExternalLink
                  size={16}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.a>
            );
          })}
        </div>

        {/* Direct Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-border bg-muted/30 p-8"
        >
          <h2 className="text-lg font-semibold mb-4">Direct Contact</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={18} className="text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={18} className="text-muted-foreground" />
              <span>{profile.location}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
