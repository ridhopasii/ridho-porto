"use client";

import { useState, useEffect } from "react";
import { FaInstagram, FaTiktok, FaImages, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineTag } from "react-icons/hi";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import Tiktok from "./Tiktok";
import { fetcher } from "@/services/fetcher";

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
}

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  images: string[];
  date: string;
  description: string;
  showOnHome: boolean;
  createdAt: string;
}

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState<"tiktok" | "instagram" | "gallery">("instagram");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: instagramData, error: instagramError, isLoading: instagramLoading } = useSWR(
    activeTab === "instagram" ? "/api/instagram" : null,
    fetcher
  );

  useEffect(() => {
    if (activeTab === "gallery") {
      fetchGallery();
    }
  }, [activeTab]);

  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data: GalleryItem[] = await res.json();
        setGalleryItems(data);
        setFilteredItems(data);
        
        // Extract unique categories
        const cats = ["All", ...Array.from(new Set(data.map(item => item.category)))];
        setCategories(cats);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === cat));
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Menu */}
      <div className="w-full rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800 yellow:bg-amber-100 ramadan:bg-emerald-950/80 valentine:bg-rose-100">
        <div className="relative grid grid-cols-3 gap-1">
          <button
            onClick={() => setActiveTab("instagram")}
            className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "instagram"
                ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
            }`}
          >
            {activeTab === "instagram" && (
              <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaInstagram size={14} />
              Instagram
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tiktok")}
            className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "tiktok"
                ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
            }`}
          >
            {activeTab === "tiktok" && (
              <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaTiktok size={14} />
              TikTok
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "gallery"
                ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
            }`}
          >
            {activeTab === "gallery" && (
              <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaImages size={14} />
              Galeri Foto
            </span>
          </button>
        </div>
      </div>

      {/* Tabs Contents */}
      <div className="overflow-x-clip">
        {activeTab === "tiktok" && <Tiktok />}
        
        {activeTab === "instagram" && (
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {instagramLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse border border-neutral-200/50 dark:border-neutral-800/50" />
                ))}
              </div>
            ) : instagramError || !instagramData?.data ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500 dark:text-neutral-400">
                <FaInstagram size={48} className="mb-4 opacity-55 text-red-500" />
                <p className="text-lg font-medium">Gagal memuat konten Instagram.</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Silakan coba beberapa saat lagi.</p>
              </div>
            ) : instagramData?.isMock ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500 dark:text-neutral-400">
                <FaInstagram size={48} className="mb-4 opacity-40" />
                <p className="text-lg font-medium">Instagram tidak tersedia saat ini.</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Konten akan muncul setelah integrasi terhubung.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(instagramData.data as InstagramPost[]).map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 relative">
                      <img
                        src={post.media_url}
                        alt={post.caption || "Instagram Post"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5">
                        <div className="flex justify-end">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded border border-pink-500/20">
                            {post.media_type.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-white text-xs line-clamp-3 font-light leading-relaxed">
                          {post.caption || "Lihat postingan di Instagram"}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 items-center border-b border-neutral-200 dark:border-neutral-800 pb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`
                    px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 capitalize
                    ${selectedCategory === cat 
                      ? "bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-neutral-900 shadow-sm" 
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600"
                    }
                  `}
                >
                  {cat === "All" ? "Semua" : cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {loadingGallery ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[4/3] rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse border border-neutral-200 dark:border-neutral-800" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredItems.map((item, index) => {
                    const imgUrl = item.images?.[0];
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => openLightbox(index)}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      >
                        {/* Image wrapper */}
                        <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 relative">
                          {imgUrl ? (
                            <img 
                              src={imgUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                          )}
                          
                          {/* Elegant hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded w-max mb-1 border border-blue-500/20 capitalize">
                              {item.category}
                            </span>
                            <h4 className="text-white font-bold text-sm line-clamp-1">{item.title}</h4>
                            <p className="text-neutral-300 text-xs line-clamp-2 mt-1">{item.description}</p>
                          </div>
                        </div>

                        {/* Card metadata (footer) */}
                        <div className="p-4 border-t border-neutral-100 dark:border-neutral-900">
                          <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm truncate group-hover:text-blue-500 transition-colors" title={item.title}>
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                            <span className="flex items-center gap-1">
                              <HiOutlineTag size={12} />
                              <span className="capitalize">{item.category}</span>
                            </span>
                            {item.date && (
                              <span className="flex items-center gap-1">
                                <HiOutlineCalendar size={12} />
                                <span>{item.date}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredItems.length === 0 && (
                  <div className="py-20 text-center text-neutral-500 dark:text-neutral-400">
                    <p className="text-lg font-medium">Belum ada foto dalam galeri.</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Tambahkan beberapa foto melalui panel admin.</p>
                  </div>
                )}
              </>
            )}

            {/* Stunning Lightbox Modal */}
            {lightboxIndex !== null && filteredItems.length > 0 && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 animate-[fadeIn_0.2s_ease-out]"
                onClick={closeLightbox}
              >
                {/* Close Button */}
                <button 
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-extralight focus:outline-none transition-colors"
                  title="Close (Esc)"
                >
                  ✕
                </button>

                {/* Navigation Buttons */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 p-4 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors hidden md:block"
                  title="Previous"
                >
                  <FaChevronLeft size={20} />
                </button>

                <button 
                  onClick={nextImage}
                  className="absolute right-4 p-4 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors hidden md:block"
                  title="Next"
                >
                  <FaChevronRight size={20} />
                </button>

                {/* Lightbox Content Container */}
                <div 
                  className="w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Photo Area */}
                  <div className="flex-1 bg-neutral-950 flex items-center justify-center p-2 min-h-[300px] md:min-h-[500px]">
                    <img 
                      src={filteredItems[lightboxIndex].images?.[0]} 
                      alt={filteredItems[lightboxIndex].title} 
                      className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg"
                    />
                  </div>

                  {/* Metadata Sidebar Area */}
                  <div className="w-full md:w-80 bg-neutral-900 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-800 text-white">
                    <div className="space-y-4">
                      {/* Category Badge */}
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20 w-max block capitalize">
                        {filteredItems[lightboxIndex].category}
                      </span>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold tracking-tight text-neutral-50">
                        {filteredItems[lightboxIndex].title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-neutral-400 leading-relaxed font-light">
                        {filteredItems[lightboxIndex].description}
                      </p>
                    </div>

                    {/* Meta Footer */}
                    <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <HiOutlineCalendar size={13} className="text-neutral-400" />
                        <span>{filteredItems[lightboxIndex].date || "N/A"}</span>
                      </span>
                      <span className="text-neutral-600">ID: #{filteredItems[lightboxIndex].id}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMedia;
