"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function GuestbookManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guestbook");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleToggleApproval = async (id: number, currentStatus: boolean) => {
    const toastId = toast.loading("Updating status...");
    const res = await fetch("/api/admin/guestbook", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved: !currentStatus }),
    });

    if (res.ok) {
      toast.success("Status updated!", { id: toastId });
      fetchData();
    } else {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  const handleSendReply = async (id: number, originalMsg: string) => {
    const input = document.getElementById(`reply-input-${id}`) as HTMLInputElement;
    const replyText = input?.value.trim();

    // If replyText is empty, we delete the reply, otherwise we append it
    const updatedMessage = replyText ? `${originalMsg} [ADMIN_REPLY] ${replyText}` : originalMsg;
    
    const toastId = toast.loading(replyText ? "Mengirim balasan..." : "Menghapus balasan...");
    const res = await fetch("/api/admin/guestbook", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, message: updatedMessage }),
    });

    if (res.ok) {
      toast.success(replyText ? "Balasan terkirim!" : "Balasan dihapus!", { id: toastId });
      setReplyingId(null);
      fetchData();
    } else {
      toast.error("Gagal memperbarui pesan", { id: toastId });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus pesan ini secara permanen?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/guestbook?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Dihapus!", { id: toastId });
      fetchData();
    } else {
      toast.error("Gagal menghapus", { id: toastId });
    }
  };

  // Format date cleanly
  const formatMsgDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-500 text-sm font-medium">Memuat pesan...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm">
            <div>
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Manajemen Guestbook</h3>
              <p className="text-xs text-neutral-500 mt-1">Total {messages.length} pesan masuk</p>
            </div>
            <button onClick={fetchData} className="text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors font-medium text-neutral-700 dark:text-neutral-300">
              🔄 Segarkan
            </button>
          </div>

          <div className="grid gap-4">
            {messages.map((msg) => {
              const parts = (msg.message || "").split(" [ADMIN_REPLY] ");
              const originalMessage = parts[0];
              const adminReply = parts[1] || "";

              return (
                <div key={msg.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Card Header */}
                  <div className="flex justify-between items-center px-5 py-3 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 leading-tight">
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-neutral-500">{msg.email} • {formatMsgDate(msg.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleApproval(msg.id, msg.isApproved)}
                        className={`px-3 py-1 text-[11px] font-bold tracking-wide uppercase rounded-full transition-colors border ${
                          msg.isApproved 
                            ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50" 
                            : "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50"
                        }`}
                        title={msg.isApproved ? "Batalkan Persetujuan" : "Setujui Pesan"}
                      >
                        {msg.isApproved ? "✓ Disetujui" : "⏳ Menunggu"}
                      </button>
                    </div>
                  </div>

                  {/* Card Body (Messages) */}
                  <div className="p-5 space-y-4">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                      {originalMessage}
                    </p>

                    {adminReply && (
                      <div className="ml-4 pl-4 border-l-2 border-teal-500 space-y-1.5 animate-fade-in">
                        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold">
                          <span className="bg-teal-100 dark:bg-teal-900/40 w-5 h-5 rounded-full flex items-center justify-center">👑</span> 
                          Balasan Anda
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-lg rounded-tl-none">
                          {adminReply}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer (Actions) */}
                  <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-950/30 border-t border-neutral-100 dark:border-neutral-800/60 flex justify-between items-center">
                    <button 
                      onClick={() => setReplyingId(replyingId === msg.id ? null : msg.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg"
                    >
                      <span>💬</span> {adminReply ? "Edit Balasan" : "Balas Pesan"}
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg"
                      title="Hapus Permanen"
                    >
                      <span>🗑</span> Hapus
                    </button>
                  </div>

                  {/* Inline Reply Form */}
                  {replyingId === msg.id && (
                    <div className="px-5 py-4 bg-blue-50/50 dark:bg-blue-950/10 border-t border-blue-100 dark:border-blue-900/30 animate-fade-in">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          {adminReply ? "Edit Balasan" : "Tulis Balasan Admin"}
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder={adminReply ? "Kosongkan lalu kirim untuk menghapus balasan..." : "Ketik balasan Anda..."}
                            defaultValue={adminReply}
                            id={`reply-input-${msg.id}`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSendReply(msg.id, originalMessage);
                            }}
                            className="flex-1 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            autoFocus
                          />
                          <button 
                            onClick={() => handleSendReply(msg.id, originalMessage)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                          >
                            Kirim
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {messages.length === 0 && (
              <div className="py-12 text-center flex flex-col items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl border-dashed">
                <span className="text-4xl mb-3 opacity-50">📭</span>
                <p className="text-neutral-500 font-medium">Belum ada pesan yang masuk.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
