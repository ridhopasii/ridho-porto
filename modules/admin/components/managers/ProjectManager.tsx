"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import ProjectFormModal from "../ProjectFormModal";
import ImageUploader from "../ImageUploader";

export default function ProjectManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
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
    const { data } = await supabase.from("Project").select("*").order("id", { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  const handleUpdateImage = async (id: number, newImageUrl: string) => {
    const toastId = toast.loading("Saving to database...");
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, imageUrl: newImageUrl }),
    });

    if (res.ok) {
      toast.success("Image updated!", { id: toastId });
      fetchData();
    } else {
      toast.error("Failed to update image", { id: toastId });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
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
        <ProjectFormModal 
          project={editingProject} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage your portfolio projects.</p>
        <button 
          onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Project
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={`proj-${project.id}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-5 rounded-lg flex flex-col gap-4 shadow-sm relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-neutral-900 p-1 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700">
                <button onClick={() => { setEditingProject(project); setIsModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                  ✎ Edit
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                  🗑 Delete
                </button>
              </div>

              <div>
                <h4 className="font-bold text-lg pr-20">{project.title}</h4>
                <p className="text-xs text-neutral-500 truncate mb-2">{project.slug}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tags?.split(',').map((t: string) => (
                    <span key={t} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-xs rounded-full">{t.trim()}</span>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-semibold mb-2">Thumbnail Image</p>
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-32 object-cover rounded-md mb-3" />
                )}
                <ImageUploader onChange={(url) => handleUpdateImage(project.id, url)} path="projects" />
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-neutral-500 italic">No projects found.</p>}
        </div>
      )}
    </div>
  );
}
