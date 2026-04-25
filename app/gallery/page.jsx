'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import Navbar from '@/components/Navbar';
import {
  LayoutGrid,
  List,
  Calendar,
  Tag,
  SortAsc,
  SortDesc,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';

const CATEGORIES = ['Semua', 'kegiatan', 'prestasi', 'organisasi', 'pendidikan', 'lainnya'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'name_asc', label: 'Nama A–Z' },
  { value: 'name_desc', label: 'Nama Z–A' },
];

const CAT_COLORS = {
  kegiatan: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  prestasi: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  organisasi: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
  pendidikan: 'bg-green-500/20 border-green-500/30 text-green-400',
  lainnya: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
};

// ── Lightbox ──────────────────────────────────────────
function Lightbox({ items, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  // Flatten all images across items into a single list with metadata
  const flat = items.flatMap((item) =>
    (Array.isArray(item.images) ? item.images : []).map((src) => ({
      src,
      title: item.title,
      date: item.date,
      category: item.category,
    }))
  );

  const prev = () => setCurrent((c) => (c - 1 + flat.length) % flat.length);
  const next = () => setCurrent((c) => (c + 1) % flat.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  if (!flat.length) return null;
  const photo = flat[current];

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-6 right-6 p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all z-10"
        onClick={onClose}
      >
        <X size={22} />
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 md:left-8 p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all z-10"
        onClick={(e) => { e.stopPropagation(); prev(); }}
      >
        <ChevronLeft size={26} />
      </button>

      {/* Image */}
      <div className="max-w-5xl max-h-[80vh] px-20" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.src}
          alt={photo.title}
          className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl mx-auto"
        />
        <div className="text-center mt-6">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mr-3 ${CAT_COLORS[photo.category] || 'bg-white/10 border-white/20 text-gray-400'}`}>
            {photo.category}
          </span>
          <p className="text-white font-bold inline">{photo.title}</p>
          {photo.date && <span className="text-gray-500 text-sm ml-3">• {photo.date}</span>}
          <p className="text-gray-600 text-xs mt-2">{current + 1} / {flat.length}</p>
        </div>
      </div>

      {/* Next */}
      <button
        className="absolute right-4 md:right-8 p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all z-10"
        onClick={(e) => { e.stopPropagation(); next(); }}
      >
        <ChevronRight size={26} />
      </button>
    </div>
  );
}

// ── Main Gallery Page ─────────────────────────────────
export default function GalleryPage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grouped'); // 'all' | 'grouped'
  const [lightboxItems, setLightboxItems] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ── Realtime fetch ──
  const fetchItems = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('Gallery')
      .select('*')
      .order('createdAt', { ascending: false });
    setAllItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
    // Supabase realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel('gallery-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Gallery' }, fetchItems)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchItems]);

  // ── Filter + Sort ──
  const filtered = allItems.filter(
    (item) => activeCategory === 'Semua' || item.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'name_asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'name_desc') return (b.title || '').localeCompare(a.title || '');
    return 0;
  });

  // ── Grouped by category ──
  const categories = [...new Set(sorted.map((i) => i.category).filter(Boolean))];

  const openLightbox = (items, imgIdx) => {
    setLightboxItems(items);
    setLightboxIndex(imgIdx);
  };

  const totalPhotos = sorted.reduce(
    (acc, item) => acc + (Array.isArray(item.images) ? item.images.length : 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      {lightboxItems && (
        <Lightbox
          items={lightboxItems}
          startIndex={lightboxIndex}
          onClose={() => setLightboxItems(null)}
        />
      )}

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                <LayoutGrid size={13} className="text-purple-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">
                  Visual Journey
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black font-outfit uppercase tracking-tighter leading-none">
                Galeri <span className="text-purple-500">Foto</span>
              </h1>
              <p className="text-gray-500 mt-4 max-w-xl text-sm font-medium leading-relaxed">
                Kumpulan momen, kegiatan, dan dokumentasi perjalanan profesional serta organisasi.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-center">
                <p className="text-2xl font-black text-white">{sorted.length}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Album</p>
              </div>
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-center">
                <p className="text-2xl font-black text-purple-500">{totalPhotos}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Foto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-0 z-30 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
                {cat !== 'Semua' && (
                  <span className="ml-1.5 opacity-60">
                    ({allItems.filter((i) => i.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort + View Mode */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-300 focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                  {opt.label}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-2 transition-all ${viewMode === 'all' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-white'}`}
                title="Tampilkan Semua"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-2 transition-all ${viewMode === 'grouped' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-white'}`}
                title="Kelompokkan per Kategori"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
              <ImageIcon size={64} className="mx-auto text-gray-800 mb-6" />
              <p className="text-gray-600 font-black uppercase tracking-widest text-sm">
                {activeCategory === 'Semua' ? 'Galeri masih kosong.' : `Tidak ada foto di kategori "${activeCategory}".`}
              </p>
            </div>
          ) : viewMode === 'all' ? (
            // ── ALL PHOTOS flat grid ──
            <div>
              <div className="flex items-center gap-3 mb-8">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {sorted.length} album • {totalPhotos} foto
                </p>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sorted.map((item, albumIdx) =>
                  (Array.isArray(item.images) ? item.images : []).map((src, imgIdx) => (
                    <div
                      key={`${item.id}-${imgIdx}`}
                      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-purple-500/40 transition-all"
                      onClick={() => openLightbox([item], imgIdx)}
                    >
                      <img src={src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ZoomIn size={28} className="text-white" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-all duration-300">
                        <p className="text-white text-xs font-bold truncate">{item.title}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${CAT_COLORS[item.category] || 'bg-white/10 border-white/20 text-gray-400'}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // ── GROUPED by category ──
            <div className="space-y-20">
              {(activeCategory === 'Semua' ? categories : [activeCategory]).map((cat) => {
                const catItems = sorted.filter((i) => i.category === cat);
                if (!catItems.length) return null;
                const catPhotos = catItems.reduce((acc, i) => acc + (Array.isArray(i.images) ? i.images.length : 0), 0);

                return (
                  <div key={cat}>
                    {/* Category Header */}
                    <div className="flex items-center gap-5 mb-8">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${CAT_COLORS[cat] || 'bg-white/10 border-white/20 text-gray-400'}`}>
                        {cat}
                      </span>
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        {catItems.length} album • {catPhotos} foto
                      </span>
                    </div>

                    {/* Album Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catItems.map((item) => {
                        const imgs = Array.isArray(item.images) ? item.images : [];
                        return (
                          <div
                            key={item.id}
                            className="group bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-purple-500/30 transition-all duration-500"
                          >
                            {/* Photo grid preview */}
                            <div
                              className="relative cursor-pointer"
                              onClick={() => openLightbox([item], 0)}
                            >
                              {imgs.length === 0 ? (
                                <div className="aspect-video bg-white/5 flex items-center justify-center">
                                  <ImageIcon size={40} className="text-gray-700" />
                                </div>
                              ) : imgs.length === 1 ? (
                                <div className="aspect-video overflow-hidden">
                                  <img src={imgs[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                </div>
                              ) : imgs.length === 2 ? (
                                <div className="aspect-video grid grid-cols-2 gap-0.5 overflow-hidden">
                                  {imgs.slice(0, 2).map((src, i) => (
                                    <img key={i} src={src} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                  ))}
                                </div>
                              ) : imgs.length === 3 ? (
                                <div className="aspect-video grid grid-cols-2 gap-0.5 overflow-hidden">
                                  <img src={imgs[0]} className="w-full h-full object-cover row-span-2 group-hover:scale-105 transition-all duration-700" />
                                  <img src={imgs[1]} className="w-full object-cover group-hover:scale-105 transition-all duration-700" />
                                  <img src={imgs[2]} className="w-full object-cover group-hover:scale-105 transition-all duration-700" />
                                </div>
                              ) : (
                                <div className="aspect-video grid grid-cols-2 gap-0.5 overflow-hidden">
                                  {imgs.slice(0, 3).map((src, i) => (
                                    <img key={i} src={src} className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${i === 0 ? 'row-span-2' : ''}`} />
                                  ))}
                                  <div className="bg-black/60 flex items-center justify-center font-black text-white text-xl">
                                    +{imgs.length - 3}
                                  </div>
                                </div>
                              )}

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white text-xs font-black uppercase tracking-widest">
                                  <ZoomIn size={14} /> Lihat {imgs.length} Foto
                                </div>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar size={11} className="text-gray-600" />
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                  {item.date || '—'}
                                </span>
                                <span className="ml-auto text-[10px] text-purple-500 font-black">
                                  {imgs.length} Foto
                                </span>
                              </div>
                              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 uppercase tracking-tight">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="text-gray-500 text-xs mt-2 leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-700">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Gallery
      </footer>
    </main>
  );
}
