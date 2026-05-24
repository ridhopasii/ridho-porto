"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import ProjectFormModal from "./ProjectFormModal";
import AwardFormModal from "./AwardFormModal";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "achievements">("projects");
  const [projects, setProjects] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [editingAward, setEditingAward] = useState<any | null>(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from("Project").select("*").order("id", { ascending: false });
    if (pData) setProjects(pData);

    const { data: aData } = await supabase.from("Award").select("*").order("id", { ascending: false });
    if (aData) setAchievements(aData);
    
    setLoading(false);
  };

  const handleUpdateProjectImage = async (id: number, newImageUrl: string) => {
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

  const handleUpdateAchievementImage = async (id: number, newImageUrl: string) => {
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

  const handleDeleteProject = async (id: number) => {
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

  const handleDeleteAward = async (id: number) => {
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
    <div className="space-y-8">
      {isProjectModalOpen && (
        <ProjectFormModal 
          project={editingProject} 
          onClose={() => setIsProjectModalOpen(false)} 
          onSuccess={() => { setIsProjectModalOpen(false); fetchData(); }} 
        />
      )}
      
      {isAwardModalOpen && (
        <AwardFormModal 
          award={editingAward} 
          onClose={() => setIsAwardModalOpen(false)} 
          onSuccess={() => { setIsAwardModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold">Content Management System</h2>
          
          <div className="flex gap-2 bg-neutral-200 dark:bg-neutral-900 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "projects" ? "bg-white dark:bg-neutral-800 shadow-sm" : "hover:text-neutral-600 dark:hover:text-neutral-300"}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab("achievements")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "achievements" ? "bg-white dark:bg-neutral-800 shadow-sm" : "hover:text-neutral-600 dark:hover:text-neutral-300"}`}
            >
              Achievements
            </button>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-neutral-500">Loading data...</p>
        ) : (
          <div>
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-neutral-500">Manage your portfolio projects.</p>
                  <button 
                    onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    + Add Project
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div key={`proj-${project.id}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-5 rounded-lg flex flex-col gap-4 shadow-sm relative group">
                      
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-neutral-900 p-1 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700">
                        <button onClick={() => { setEditingProject(project); setIsProjectModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                          ✎ Edit
                        </button>
                        <button onClick={() => handleDeleteProject(project.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
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
                        <ImageUploader onUploadSuccess={(url) => handleUpdateProjectImage(project.id, url)} />
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-neutral-500 italic">No projects found.</p>}
                </div>
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-neutral-500">Manage your awards and certifications.</p>
                  <button 
                    onClick={() => { setEditingAward(null); setIsAwardModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    + Add Achievement
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {achievements.map((award) => (
                    <div key={`award-${award.id}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-5 rounded-lg flex flex-col gap-4 shadow-sm relative group">
                      
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-neutral-900 p-1 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700">
                        <button onClick={() => { setEditingAward(award); setIsAwardModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                          ✎ Edit
                        </button>
                        <button onClick={() => handleDeleteAward(award.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
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
                        <ImageUploader onUploadSuccess={(url) => handleUpdateAchievementImage(award.id, url)} />
                      </div>
                    </div>
                  ))}
                  {achievements.length === 0 && <p className="text-neutral-500 italic">No achievements found.</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
