import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useData } from '@/contexts/DataContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function ChatbotSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Halo! Saya adalah AI Assistant Ridho. Ada yang ingin ditanyakan tentang pengalaman atau proyek Ridho?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data } = useData();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // In production, you'd typically want to hide this key behind a backend route
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `
      Kamu adalah asisten virtual untuk portofolio Ridho Robbi Pasi.
      Berikut adalah informasi tentang Ridho:
      Nama: ${data.profile.name}
      Bio: ${data.profile.bio}
      Lokasi: ${data.profile.location}
      Role: ${data.profile.title}
      Tech Stacks: ${data.techStacks.join(', ')}
      
      Jawablah pertanyaan pengunjung dengan ramah, profesional, dan dalam bahasa Indonesia. 
      Jika ditanya hal di luar konteks portofolio, teknologi, atau pengalaman Ridho, arahkan kembali ke topik portofolio secara sopan.
      Gunakan format markdown jika perlu, tapi usahakan jawabannya singkat dan langsung (maksimal 2-3 paragraf).
      `;

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Ini adalah konteks untuk semua percakapan kita selanjutnya: " + systemPrompt }]
          },
          {
            role: "model",
            parts: [{ text: "Mengerti. Saya akan bertindak sebagai asisten virtual untuk Ridho Robbi Pasi dan menjawab berdasarkan informasi tersebut." }]
          },
          ...messages.slice(1).map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        ]
      });

      const result = await chat.sendMessage(userMsg);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        content: 'Maaf, terjadi kesalahan saat menyambungkan ke sistem AI. Coba lagi nanti.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-50"
      >
        <Bot size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-card border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold text-sm">AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`px-3 py-2 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted text-foreground rounded-tl-none'
                    }`}>
                      {/* Simple rendering for now. For robust markdown, use react-markdown */}
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted text-muted-foreground">
                      <Bot size={14} />
                    </div>
                    <div className="px-3 py-2 rounded-2xl bg-muted text-foreground rounded-tl-none flex items-center gap-1">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-background">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya sesuatu..."
                  className="flex-1 px-3 py-2 bg-muted rounded-full text-sm outline-none focus:ring-1 focus:ring-primary transition-all"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
