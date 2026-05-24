"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  messages: any[];
}

export default function Guestbook({ messages }: Props) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Submitting your message...");
    try {
      // Create an endpoint for public users to submit guestbook entries without auth
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Message submitted! It will appear after approval.", { id: toastId });
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-bold mb-4">Leave a message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your Name" className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950" />
            <input required type="email" name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Your Email" className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950" />
          </div>
          <textarea required name="message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Your Message" rows={4} className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950" />
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Submit</button>
        </form>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Messages</h3>
        {messages.length === 0 ? (
          <p className="text-neutral-500 italic">No messages yet. Be the first!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                <h4 className="font-bold text-lg">{msg.name}</h4>
                <p className="text-xs text-neutral-500 mb-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                <p className="text-neutral-700 dark:text-neutral-300">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
