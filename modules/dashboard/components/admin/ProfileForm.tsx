"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  TbBadge,
  TbAt,
  TbPhoto,
  TbEdit,
  TbUpload,
  TbShare,
  TbDeviceFloppy,
  TbCheck,
  TbLoader2,
  TbExternalLink,
} from "react-icons/tb";

const inputClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200";
const labelClass =
  "text-[11px] font-semibold uppercase tracking-wider text-neutral-500";
const cardClass =
  "rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900";

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
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setHeroFile(e.target.files[0]);
      setHeroImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Gagal mengunggah " + path);
    const data = await res.json();
    return data.url;
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan profil...");

    try {
      const formData = new FormData(e.currentTarget);
      const data: any = Object.fromEntries(formData.entries());
      data.id = initialData?.id || undefined;

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

      if (!res.ok) throw new Error("Gagal menyimpan profil");

      toast.success("Profil tersimpan!", { id: toastId });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-[1200px] p-4 lg:p-8">
      <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleAvatarChange} />
      <input type="file" accept="image/*" className="hidden" ref={heroInputRef} onChange={handleHeroChange} />

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Profil & Identitas
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Atur identitas utama yang tampil di seluruh website.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
            isSaved
              ? "bg-emerald-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isSaving ? (
            <TbLoader2 className="animate-spin" size={18} />
          ) : isSaved ? (
            <TbCheck size={18} />
          ) : (
            <TbDeviceFloppy size={18} />
          )}
          {isSaving ? "Menyimpan..." : isSaved ? "Tersimpan" : "Simpan Perubahan"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left */}
        <div className="space-y-6 md:col-span-8">
          {/* Identitas Utama */}
          <section className={cardClass}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-neutral-100 p-2 text-neutral-500 dark:bg-neutral-800">
                <TbBadge size={20} />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Identitas Utama</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Nama Lengkap</label>
                <input name="fullName" type="text" className={inputClass} defaultValue={initialData?.fullName || ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-medium text-neutral-400">@</span>
                  <input name="username" type="text" className={inputClass + " pl-9"} defaultValue={initialData?.username || ""} />
                </div>
              </div>
              <div className="col-span-full flex flex-col gap-1.5">
                <label className={labelClass}>Jabatan / Titel</label>
                <input name="title" type="text" className={inputClass} defaultValue={initialData?.title || ""} placeholder="mis. Fullstack Developer" />
              </div>
              <div className="col-span-full flex flex-col gap-1.5">
                <label className={labelClass}>Bio</label>
                <textarea name="bio" rows={4} className={inputClass + " resize-none leading-relaxed"} defaultValue={initialData?.bio || ""} />
              </div>
            </div>
          </section>

          {/* Kontak & Lokasi */}
          <section className={cardClass}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-neutral-100 p-2 text-neutral-500 dark:bg-neutral-800">
                <TbAt size={20} />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Kontak & Lokasi</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Email</label>
                <input name="email" type="email" className={inputClass} defaultValue={initialData?.email || ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Lokasi</label>
                <input name="location" type="text" className={inputClass} defaultValue={initialData?.location || ""} placeholder="mis. Jambi, Indonesia" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Link WhatsApp</label>
                <input name="whatsappUrl" type="url" className={inputClass} defaultValue={initialData?.whatsappUrl || ""} placeholder="https://wa.me/62..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Link CV</label>
                <input name="cvLink" type="url" className={inputClass} defaultValue={initialData?.cvLink || ""} placeholder="https://..." />
              </div>
            </div>
          </section>

          {/* Catatan sosial media */}
          <section className={cardClass + " flex items-center justify-between gap-4"}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-neutral-100 p-2 text-neutral-500 dark:bg-neutral-800">
                <TbShare size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Tautan Sosial Media</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Dikelola di menu khusus agar tampil di halaman kontak.
                </p>
              </div>
            </div>
            <Link
              href="social"
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <TbExternalLink size={15} /> Buka Sosial Media
            </Link>
          </section>
        </div>

        {/* Right: Media */}
        <div className="space-y-6 md:col-span-4">
          <section className={cardClass}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-neutral-100 p-2 text-neutral-500 dark:bg-neutral-800">
                <TbPhoto size={20} />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Media</h2>
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col gap-4">
                <label className={labelClass}>Foto Profil (Avatar)</label>
                <div className="flex items-center gap-4">
                  <div className="group relative shrink-0 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                    <div className="h-16 w-16 overflow-hidden rounded-full border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <TbEdit className="text-white" size={18} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Klik untuk ganti avatar</span>
                    <span className="text-[10px] text-neutral-400">Otomatis dikonversi ke WebP</span>
                  </div>
                </div>
              </div>

              <hr className="border-neutral-200 dark:border-neutral-800" />

              {/* Hero */}
              <div className="space-y-3">
                <label className={labelClass}>Gambar Hero / Sampul</label>
                <div className="group relative h-32 w-full overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroImage} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" alt="Hero" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                    <button type="button" onClick={() => heroInputRef.current?.click()} className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:scale-105 hover:bg-white">
                      <TbUpload size={14} /> Ganti Gambar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
