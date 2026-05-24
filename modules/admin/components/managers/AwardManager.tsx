"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import AwardFormModal from "../AwardFormModal";
import ImageUploader from "../ImageUploader";

export default function AwardManager() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAward, setEditingAward] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("Award").select("*").order("id", { ascending: false });
    if (data) setAchievements(data);
    setLoading(false);
  };

  const handleUpdateImage = async (id: number, newImageUrl: string) => {
    const toastId = toast.loading("Saving to database...");
    const res = await fetch("/api/admin/awards", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, images: newImageUrl }),
    });

    if (res.ok) {
      toast.success("Image updated!", { id: toastId });
      fetchData();
    } else {
      toast.error("Failed to update image", { id: toastId });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/awards?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!", { id: toastId });
      fetchData();
    } else {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <AwardFormModal 
          award={editingAward} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage your awards and certifications.</p>
        <button 
          onClick={() => { setEditingAward(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Achievement
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {achievements.map((award) => (
            <div key={`award-${award.id}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-5 rounded-lg flex flex-col gap-4 shadow-sm relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-neutral-900 p-1 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700">
                <button onClick={() => { setEditingAward(award); setIsModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                  ✎ Edit
                </button>
                <button onClick={() => handleDelete(award.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                  🗑 Delete
                </button>
              </div>

              <div>
                <h4 className="font-bold text-lg pr-20">{award.title}</h4>
                <p className="text-xs text-neutral-500 mb-2">{award.organizer} • {award.date}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{award.description}</p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-semibold mb-2">Certificate/Proof Image</p>
                {award.images && (
                  <img src={award.images} alt={award.title} className="w-full h-32 object-contain rounded-md mb-3 bg-neutral-50 dark:bg-neutral-800" />
                )}
                <ImageUploader onUploadSuccess={(url) => handleUpdateImage(award.id, url)} />
              </div>
            </div>
          ))}
          {achievements.length === 0 && <p className="text-neutral-500 italic">No achievements found.</p>}
        </div>
      )}
    </div>
  );
}
