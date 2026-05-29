"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProfileManager() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      if (!res.ok) throw new Error("Gagal mengambil data profil");
      const data = await res.json();
      setProfile(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading("Menyimpan...");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Gagal menyimpan data");
      }

      toast.success("Profil berhasil disimpan!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1,2,3].map(i=><div key={i} className="h-20 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Kelola informasi profil utama, media sosial, dan meta data personal.
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Identitas Utama</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Nama Lengkap (Full Name)</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Username (Handle, e.g. @ridhopasii)</label>
              <input
                type="text"
                name="username"
                value={profile.username || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Nama Panggilan (Name)</label>
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Gelar Pekerjaan (Title)</label>
              <input
                type="text"
                name="title"
                value={profile.title || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Bio Singkat</label>
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Kontak & Lokasi</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Telepon (Phone)</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Lokasi (Location)</label>
              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Link CV (PDF)</label>
              <input
                type="text"
                name="cvLink"
                value={profile.cvLink || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Media</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Avatar URL</label>
              <input
                type="text"
                name="avatarUrl"
                value={profile.avatarUrl || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Hero Image URL</label>
              <input
                type="text"
                name="heroImage"
                value={profile.heroImage || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">About Image URL</label>
              <input
                type="text"
                name="aboutImage"
                value={profile.aboutImage || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="font-semibold dark:text-white">Social Links Tambahan</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Github URL</label>
              <input
                type="text"
                name="github_url"
                value={profile.github_url || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">LinkedIn URL</label>
              <input
                type="text"
                name="linkedin_url"
                value={profile.linkedin_url || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Instagram URL</label>
              <input
                type="text"
                name="instagram_url"
                value={profile.instagram_url || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
