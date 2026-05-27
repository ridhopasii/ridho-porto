"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";

export default function GuestbookManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder")
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("Guestbook").select("*").order("createdAt", { ascending: false });
    if (data) setMessages(data);
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/guestbook?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!", { id: toastId });
      fetchData();
    } else {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
              <div>
                <h4 className="font-bold text-base">{msg.name} <span className="text-sm font-normal text-neutral-500">({msg.email})</span></h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{msg.message}</p>
                <p className="text-xs text-neutral-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="flex flex-row sm:flex-col gap-2 items-start sm:items-end justify-center min-w-[120px]">
                <button 
                  onClick={() => handleToggleApproval(msg.id, msg.isApproved)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md w-full transition-colors ${
                    msg.isApproved 
                      ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {msg.isApproved ? "Approved ✓" : "Pending ⏳"}
                </button>
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 rounded-md w-full transition-colors"
                >
                  Delete 🗑
                </button>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-neutral-500 italic">No messages found.</p>}
        </div>
      )}
    </div>
  );
}
