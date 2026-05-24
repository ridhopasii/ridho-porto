"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const { error } = await supabase
      .from("Project")
      .update({ imageUrl: newImageUrl })
      .eq("id", id);
      
    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success("Project image updated!", { id: toastId });
      fetchData();
    }
  };

  const handleUpdateAchievementImage = async (id: number, newImageUrl: string) => {
    const toastId = toast.loading("Saving to database...");
    const { error } = await supabase
      .from("Award")
      .update({ images: newImageUrl })
      .eq("id", id);
      
    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success("Achievement image updated!", { id: toastId });
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-bold mb-4">Content Image Manager</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Upload new images to automatically convert them to WebP and update your projects/achievements.
        </p>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="space-y-12">
            <div>
              <h3 className="text-lg font-bold mb-4">Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={`proj-${project.id}`} className="border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex flex-col gap-4">
                    <div>
                      <h4 className="font-bold">{project.title}</h4>
                      <p className="text-xs text-neutral-500 truncate">{project.imageUrl}</p>
                    </div>
                    
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-32 object-cover rounded-md" />
                    )}

                    <ImageUploader 
                      onUploadSuccess={(url) => handleUpdateProjectImage(project.id, url)} 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((award) => (
                  <div key={`award-${award.id}`} className="border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex flex-col gap-4">
                    <div>
                      <h4 className="font-bold">{award.title}</h4>
                      <p className="text-xs text-neutral-500 truncate">{award.images}</p>
                    </div>
                    
                    {award.images && (
                      <img src={award.images} alt={award.title} className="w-full h-32 object-contain rounded-md" />
                    )}

                    <ImageUploader 
                      onUploadSuccess={(url) => handleUpdateAchievementImage(award.id, url)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
