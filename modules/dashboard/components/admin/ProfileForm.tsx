"use client";

import React, { useState, useRef } from "react";
import { TbBadge, TbAt, TbPhoto, TbEdit, TbUpload, TbWorld, TbTerminal, TbBriefcase, TbCamera, TbDeviceFloppy, TbCheck, TbLoader2 } from "react-icons/tb";

export default function ProfileForm({ initialData }: { initialData?: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || "/profile.webp");
  const [heroImage, setHeroImage] = useState(initialData?.heroImage || "/images/setup.jpg");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeroFile(e.target.files[0]);
      setHeroImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload " + path);
    const data = await res.json();
    return data.url;
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data: any = Object.fromEntries(formData.entries());
      
      data.id = initialData?.id || undefined;

      // Upload new images if changed
      if (avatarFile) {
        data.avatarUrl = await uploadFile(avatarFile, "avatars");
        setAvatarUrl(data.avatarUrl);
      } else {
        data.avatarUrl = avatarUrl;
      }

      if (heroFile) {
        data.heroImage = await uploadFile(heroFile, "heroes");
        setHeroImage(data.heroImage);
      } else {
        data.heroImage = heroImage;
      }

      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error(error);
      alert("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-[1200px] mx-auto p-8">
      <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleAvatarChange} />
      <input type="file" accept="image/*" className="hidden" ref={heroInputRef} onChange={handleHeroChange} />

      {/* Page Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100 mb-1">Profile & Identity</h2>
          <p className="text-neutral-500">Control your digital presence and administrative credentials.</p>
        </div>
        <button 
          type="submit"
          disabled={isSaving}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all
            ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-neutral-200 hover:scale-[1.02] active:scale-95 shadow-sm'}
          `}
        >
          {isSaving ? (
            <TbLoader2 className="animate-spin text-black" size={18} />
          ) : isSaved ? (
            <TbCheck size={18} />
          ) : (
            <TbDeviceFloppy size={18} />
          )}
          {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Primary Identity */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Section: Identitas Utama */}
          <section className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#1a1a1a] rounded-lg text-neutral-400">
                <TbBadge size={20} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-100">Identitas Utama</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Name</label>
                <input 
                  name="fullName"
                  className="bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all outline-none text-neutral-200" 
                  type="text" 
                  defaultValue={initialData?.fullName || "Ridho Robbi Pasi"} 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-600 font-medium">@</span>
                  <input 
                    name="username"
                    className="bg-[#0a0a0a] border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-sm w-full focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all outline-none text-neutral-200" 
                    type="text" 
                    defaultValue={initialData?.username || "ridhopasii"} 
                  />
                </div>
              </div>
              <div className="col-span-full flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Job Title</label>
                <input 
                  name="title"
                  className="bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all outline-none text-neutral-200" 
                  type="text" 
                  defaultValue={initialData?.title || "Fullstack Developer"} 
                />
              </div>
              <div className="col-span-full flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Bio</label>
                <textarea 
                  name="bio"
                  className="bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all resize-none outline-none leading-relaxed text-neutral-200" 
                  rows={4}
                  defaultValue={initialData?.bio || "Building modern web applications."}
                />
              </div>
            </div>
          </section>

          {/* Section: Kontak & Lokasi */}
          <section className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#1a1a1a] rounded-lg text-neutral-400">
                <TbAt size={20} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-100">Kontak & Lokasi</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Email Address</label>
                <input 
                  name="email"
                  className="bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all outline-none text-neutral-200" 
                  type="email" 
                  defaultValue={initialData?.email || "ridhorobbipasi@gmail.com"} 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Location</label>
                <input 
                  name="location"
                  className="bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all outline-none text-neutral-200" 
                  type="text" 
                  defaultValue={initialData?.location || "Indonesia"} 
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Media & Social */}
        <div className="md:col-span-4 space-y-6">
          {/* Section: Media Assets */}
          <section className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#1a1a1a] rounded-lg text-neutral-400">
                <TbPhoto size={20} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-100">Media</h3>
            </div>
            
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col gap-4">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer shrink-0" onClick={() => avatarInputRef.current?.click()}>
                    <div className="h-16 w-16 rounded-full border border-neutral-700 overflow-hidden bg-[#0a0a0a]">
                      <img src={avatarUrl} alt="Current Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <TbEdit className="text-white" size={18} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 font-medium">Click to upload new avatar</span>
                    <span className="text-[10px] text-neutral-600">Will be converted to WebP</span>
                  </div>
                </div>
              </div>
              
              <hr className="border-t border-neutral-800/50" />
              
              {/* Cover/Hero Image */}
              <div className="space-y-3">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Hero Image URL</label>
                <div className="h-32 w-full rounded-xl bg-[#0a0a0a] relative overflow-hidden group border border-neutral-800">
                  <img src={heroImage} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt="Hero Background" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <button type="button" onClick={() => heroInputRef.current?.click()} className="bg-white/90 text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 hover:bg-white hover:scale-105 transition-all">
                      <TbUpload size={14} /> Change Hero
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Social Links */}
          <section className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#1a1a1a] rounded-lg text-neutral-400">
                <TbWorld size={20} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-100">Social Links</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <TbTerminal className="text-neutral-500" size={16} />
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Github</label>
                </div>
                <input name="githubUrl" className="bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all outline-none text-neutral-200" type="url" defaultValue="https://github.com/ridhopasii" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <TbBriefcase className="text-neutral-500" size={16} />
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">LinkedIn</label>
                </div>
                <input name="linkedinUrl" className="bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all outline-none text-neutral-200" type="url" defaultValue="https://linkedin.com/in/ridhorobbipasi" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <TbCamera className="text-neutral-500" size={16} />
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Instagram</label>
                </div>
                <input name="instagramUrl" className="bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:bg-[#121212] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all outline-none text-neutral-200" type="url" defaultValue="https://instagram.com/ridhopasii" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Meta Info */}
      <footer className="mt-12 pt-6 border-t border-neutral-200 flex justify-between items-center text-neutral-400 text-xs font-medium">
        <p>© {new Date().getFullYear()} Ridho Portfolio System. Last updated: {new Date().toLocaleDateString()}.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-neutral-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-neutral-900 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </form>
  );
}
