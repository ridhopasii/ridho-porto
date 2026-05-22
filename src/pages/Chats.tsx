import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Pin, Heart, Send, LogIn, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function Chats() {
  const { data, updateChatMessages } = useData();
  const { chatMessages, pinnedMessage } = data;
  const [newMessage, setNewMessage] = useState('');
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now().toString(),
      sender: 'Guest',
      content: newMessage.trim(),
      timestamp: 'Just now',
      likes: 0,
      avatar: '/avatar1.jpg',
    };
    updateChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const handleLike = (id: string) => {
    const isLiked = likedMessages.has(id);
    const newLiked = new Set(likedMessages);
    if (isLiked) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedMessages(newLiked);

    updateChatMessages(
      chatMessages.map((msg) =>
        msg.id === id
          ? { ...msg, likes: msg.likes + (isLiked ? -1 : 1) }
          : msg
      )
    );
  };

  return (
    <div className="pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-2xl font-bold mb-2">Guestbook</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Leave a message, share your thoughts, or just say hi!
        </p>

        {/* Terminal Chat Container */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <Terminal size={14} className="text-muted-foreground ml-2" />
            <span className="text-xs text-muted-foreground">guestbook</span>
          </div>

          {/* Pinned Message */}
          <div className="flex items-start gap-3 px-4 py-3 bg-yellow-500/5 border-b border-border">
            <Pin size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{pinnedMessage.content}</p>
          </div>

          {/* Messages */}
          <div className="divide-y divide-border">
            {chatMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 self-start"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.content}</p>
                  <button
                    onClick={() => handleLike(msg.id)}
                    className={`flex items-center gap-1 mt-2 text-xs transition-colors ${
                      likedMessages.has(msg.id)
                        ? 'text-red-500'
                        : 'text-muted-foreground hover:text-red-500'
                    }`}
                  >
                    <Heart
                      size={14}
                      className={likedMessages.has(msg.id) ? 'fill-current' : ''}
                    />
                    <span>{msg.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-border bg-muted/30">
            <img
              src="/avatar1.jpg"
              alt="Guest"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sign in hint */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
          <LogIn size={16} />
          <span>
            Sign in with{' '}
            <a href="#" className="text-primary hover:underline">
              GitHub
            </a>{' '}
            to leave a verified message
          </span>
        </div>
      </motion.div>
    </div>
  );
}
