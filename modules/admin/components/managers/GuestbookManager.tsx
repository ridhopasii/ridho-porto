"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";

const PAGE_SIZE = 10;

export default function GuestbookManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<number | null>(null);

  const list = useAdminList({
    items: messages,
    searchFields: ["name", "email", "message"],
    pageSize: PAGE_SIZE,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guestbook");
      if (res.ok) setMessages(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleToggleApproval = async (id: number, currentStatus: boolean) => {
    const toastId = toast.loading("Memperbarui status...");
    const res = await fetch("/api/admin/guestbook", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved: !currentStatus }),
    });
    if (res.ok) { toast.success("Status diperbarui!", { id: toastId }); fetchData(); }
    else toast.error("Gagal memperbarui status", { id: toastId });
  };

  const handleSendReply = async (id: number, originalMsg: string) => {
    const input = document.getElementById(`reply-input-${id}`) as HTMLInputElement;
    const replyText = input?.value.trim();
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
    if (res.ok) { toast.success("Dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const formatDate = (s: string) => {
    try { return new Date(s).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return s; }
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari nama, email, pesan..." total={messages.length} filtered={list.filtered.length} />
        <button onClick={fetchData} className="flex-shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 transition-colors">
          🔄 Segarkan
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="text-sm text-neutral-500">Memuat pesan...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-semibold dark:text-white">Manajemen Guestbook</h3>
            <span className="ml-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {messages.length} pesan
            </span>
            {list.search && (
              <span className="text-xs text-neutral-400">· menampilkan {list.filtered.length} hasil</span>
            )}
          </div>

          <div className="space-y-3">
            {list.paginated.map((msg) => {
              const parts = (msg.message || "").split(" [ADMIN_REPLY] ");
              const originalMessage = parts[0];
              const adminReply = parts[1] || "";
              return (
                <div key={msg.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-5 py-3 dark:border-neutral-800/60 dark:bg-neutral-950/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 text-xs font-bold text-white shadow-sm">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-semibold leading-tight dark:text-neutral-200">{msg.name}</span>
                        <p className="text-[11px] text-neutral-500">{msg.email} · {formatDate(msg.createdAt)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleApproval(msg.id, msg.isApproved)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors ${msg.isApproved ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400" : "border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-400"}`}
                    >
                      {msg.isApproved ? "✓ Disetujui" : "⏳ Menunggu"}
                    </button>
                  </div>

                  <div className="space-y-3 p-5">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{originalMessage}</p>
                    {adminReply && (
                      <div className="ml-4 space-y-1.5 border-l-2 border-teal-500 pl-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40">👑</span>
                          Balasan Anda
                        </div>
                        <p className="whitespace-pre-line rounded-lg rounded-tl-none bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-600 dark:bg-neutral-800/40 dark:text-neutral-400">
                          {adminReply}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-5 py-3 dark:border-neutral-800/60 dark:bg-neutral-950/30">
                    <button onClick={() => setReplyingId(replyingId === msg.id ? null : msg.id)} className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
                      💬 {adminReply ? "Edit Balasan" : "Balas Pesan"}
                    </button>
                    <button onClick={() => handleDelete(msg.id)} className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
                      🗑 Hapus
                    </button>
                  </div>

                  {replyingId === msg.id && (
                    <div className="border-t border-blue-100 bg-blue-50/50 px-5 py-4 dark:border-blue-900/30 dark:bg-blue-950/10">
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        {adminReply ? "Edit Balasan" : "Tulis Balasan Admin"}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id={`reply-input-${msg.id}`}
                          defaultValue={adminReply}
                          placeholder={adminReply ? "Kosongkan lalu kirim untuk menghapus..." : "Ketik balasan..."}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSendReply(msg.id, originalMessage); }}
                          autoFocus
                          className="flex-1 rounded-lg border border-neutral-300 bg-white p-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-neutral-700 dark:bg-neutral-900"
                        />
                        <button onClick={() => handleSendReply(msg.id, originalMessage)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {list.paginated.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="mb-3 text-4xl opacity-50">📭</span>
                <p className="font-medium text-neutral-500">
                  {list.search ? `Tidak ada pesan cocok dengan "${list.search}"` : "Belum ada pesan yang masuk."}
                </p>
              </div>
            )}
          </div>

          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
