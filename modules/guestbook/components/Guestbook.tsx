"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { MdVerified } from "react-icons/md";
import { FiInfo, FiSend } from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";

interface Props {
  messages: any[];
}

export default function Guestbook({ messages }: Props) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const t = useTranslations("ChatRoomPage");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on mount
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Mengirim pesan Anda...");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Pesan terkirim! Pesan Anda akan muncul setelah disetujui admin.", { id: toastId });
      setFormData({ name: "", email: "", message: "" });
      setIsFocused(false);
    } catch (error: any) {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if the sender is admin
  const isAdmin = (msg: any) => {
    const adminNames = ["ridho robbi pasi", "ridho", "ridhopasii"];
    return adminNames.includes(msg.name.toLowerCase()) || msg.isAdmin === true;
  };

  // Format date cleanly
  const formatMsgDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" data-aos="fade-up">
      {/* Modern Chat Container */}
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg bg-white dark:bg-neutral-900/40 backdrop-blur-xl">
        {/* Chat Header */}
        <div className="flex items-center gap-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 p-4 px-6 select-none">
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 text-lg shadow-sm">
            💬
          </div>
          <div>
            <h3 className="font-bold text-neutral-800 dark:text-neutral-100">Live Guestbook</h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Mari terhubung & tinggalkan jejak Anda</p>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 md:p-6 space-y-5">
          {/* Scrollable Message Box */}
          <div className="space-y-5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800" style={{ height: "560px" }}>
            {/* Pinned Welcome Message */}
            <div className="sticky top-0 z-10 w-full rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50/90 dark:bg-teal-950/30 backdrop-blur-xl p-3 px-4 text-sm flex gap-3 items-start shadow-sm mb-4">
              <BsPinAngleFill className="text-teal-600 dark:text-teal-400 mt-1 shrink-0 animate-bounce" size={16} />
              <div>
                <h5 className="font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1.5 leading-none">
                  Pinned Message
                </h5>
                <p className="text-xs text-teal-900/80 dark:text-teal-400 mt-1.5 leading-relaxed">
                  <span className="font-semibold">@Ridho Robbi Pasi</span>: Hello welcome to my guestbook, feel free to leave any warm messages enjoy! 👋🏻
                </p>
              </div>
            </div>

            {/* List of Approved Messages */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-neutral-400 space-y-2">
                <FiInfo size={28} className="animate-pulse" />
                <p className="text-sm italic">Belum ada pesan. Jadilah yang pertama meninggalkan jejak!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 pt-2">
                {messages.map((msg) => {
                  const isSenderAdmin = isAdmin(msg);
                  // Dynamic avatar based on initials or custom admin avatar
                  const avatarUrl = isSenderAdmin
                    ? "/profile.webp"
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(msg.name)}&backgroundColor=0d9488,0f766e,115e59`;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 items-start animate-fade-in ${
                        isSenderAdmin ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm bg-neutral-100 dark:bg-neutral-800">
                        <img
                          alt={msg.name}
                          src={avatarUrl}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Message Content Container */}
                      <div className={`space-y-1 max-w-[75%] ${isSenderAdmin ? "items-end flex flex-col" : "items-start flex flex-col"}`}>
                        {/* Name and verified badge */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            {msg.name}
                          </span>
                          {isSenderAdmin && (
                            <MdVerified className="text-blue-500" size={13} title="Verified Admin" />
                          )}
                        </div>

                        {/* Bubble Message */}
                        {(() => {
                          const parts = (msg.message || "").split(" [ADMIN_REPLY] ");
                          const originalMessage = parts[0];
                          const adminReply = parts[1] || "";
                          
                          return (
                            <>
                              <div
                                className={`text-sm px-3.5 py-2.5 rounded-2xl shadow-sm transition-all duration-200 ${
                                  isSenderAdmin
                                    ? "bg-teal-600 text-white rounded-tr-none"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-200/40 dark:border-neutral-800/40"
                                }`}
                              >
                                <p className="leading-relaxed whitespace-pre-line">{originalMessage}</p>
                              </div>

                              {/* Timestamp */}
                              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 px-1 pt-0.5 block">
                                {formatMsgDate(msg.createdAt)}
                              </span>

                              {/* Nested Admin Reply Bubble */}
                              {adminReply && (
                                <div className="mt-3 ml-6 self-stretch flex gap-3 items-start animate-fade-in flex-row">
                                  {/* Admin Avatar */}
                                  <div className="relative shrink-0 w-8 h-8 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm bg-neutral-100 dark:bg-neutral-800">
                                    <img
                                      alt="Admin"
                                      src="/profile.webp"
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  
                                  {/* Reply bubble content */}
                                  <div className="space-y-1 flex-1 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                                        Ridho Robbi Pasi
                                      </span>
                                      <MdVerified className="text-blue-500" size={11} title="Verified Admin" />
                                      <span className="text-[8px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">
                                        Admin
                                      </span>
                                    </div>
                                    <div className="text-xs bg-blue-50/50 dark:bg-blue-950/20 text-neutral-800 dark:text-neutral-200 px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-blue-100/50 dark:border-blue-900/30 shadow-sm">
                                      <p className="leading-relaxed whitespace-pre-line">{adminReply}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Interactive Chat Form Input Area */}
          <div className="border-t border-neutral-150 dark:border-neutral-800 pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Expandable fields for Name & Email when focused */}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${
                  isFocused || formData.name || formData.email ? "max-h-28 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95 overflow-hidden"
                }`}
              >
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500">Nama</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama Anda..."
                    className="w-full text-xs p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/50 focus:border-teal-500 dark:focus:border-teal-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Masukkan email Anda..."
                    className="w-full text-xs p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/50 focus:border-teal-500 dark:focus:border-teal-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Message input bar */}
              <div className="flex gap-2 items-center bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all shadow-sm">
                <input
                  required
                  type="text"
                  value={formData.message}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ketik pesan Anda di sini..."
                  className="flex-grow bg-transparent text-sm border-0 focus:ring-0 focus:outline-none pl-3 py-2 text-neutral-800 dark:text-neutral-100"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
                  title="Send Message"
                >
                  <FiSend size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
