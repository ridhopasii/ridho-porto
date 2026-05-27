"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";

export default function ContactManager() {
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
    const { data } = await supabase.from("Message").select("*").order("createdAt", { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
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
            <div key={msg.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4 shadow-sm group">
              <div>
                <h4 className="font-bold text-base">{msg.name} <span className="text-sm font-normal text-neutral-500">({msg.email})</span></h4>
                <p className="text-xs text-blue-600 font-medium my-1">Subject: {msg.subject}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{msg.message}</p>
                <p className="text-xs text-neutral-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(msg.id)} className="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-neutral-500 italic">No messages found.</p>}
        </div>
      )}
    </div>
  );
}
