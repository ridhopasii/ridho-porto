'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import GalleryForm from '@/components/GalleryForm';
import Link from 'next/link';
import {
  Plus,
  Image as ImageIcon,
  Edit,
  Trash2,
  Calendar,
  LayoutGrid,
  List,
  Loader2,
  Eye,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = ['Semua', 'kegiatan', 'prestasi', 'organisasi', 'pendidikan', 'lainnya'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'name_asc', label: 'Nama A–Z' },
  { value: 'name_desc', label: 'Nama Z–A' },
];
const CAT_BADGE = {
  kegiatan: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  prestasi: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  organisasi: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  pendidikan: 'bg-green-500/10 text-green-400 border-green-500/20',
  lainnya: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [deletingId, setDeletingId] = useState(null);
  const [editItem, setEditItem] = useState(null);    // item being edited inline
  const [showAddForm, setShowAddForm] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchItems = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('Gallery')
      .select('*')
      .order('createdAt', { ascending: false });
    setItems(data || []);
    setLoading(false);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchItems();

    const supabase = createClient();
    const channel = supabase
      .channel('admin-gallery-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Gallery' }, () => {
        fetchItems();
        setRealtimeStatus('live');
      })
      .subscribe((status) => {
        setRealtimeStatus(status === 'SUBSCRIBED' ? 'live' : 'connecting');
      });

    return () => supabase.removeChannel(channel);
  }, [fetchItems]);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus item galeri ini?')) return;
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from('Gallery').delete().eq('id', id);
    setDeletingId(null);
    // realtime will trigger fetchItems
  };

  // Filter + Sort
  const filtered = items.filter(
    (i) => activeCategory === 'Semua' || i.category === activeCategory
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'name_asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'name_desc') return (b.title || '').localeCompare(a.title || '');
    return 0;
  });

  const totalPhotos = items.reduce(
    (acc, i) => acc + (Array.isArray(i.images) ? i.images.length : 0),
    0
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-white/5 px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-black font-outfit uppercase tracking-tight flex items-center gap-3">
                  <ImageIcon className="text-purple-500" size={22} />
                  Manajemen Galeri
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${realtimeStatus === 'live' ? 'text-blue-500' : 'text-yellow-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${realtimeStatus === 'live' ? 'bg-blue-500 animate-pulse' : 'bg-yellow-500'}`} />
                    {realtimeStatus === 'live' ? 'Realtime Aktif' : 'Menghubungkan...'}
                  </span>
                  {lastUpdated && (
                    <span className="text-[10px] text-gray-600 font-bold">
                      Diperbarui {lastUpdated.toLocaleTimeString('id-ID')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/gallery"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-[var(--border-subtle)] rounded-xl text-xs font-bold text-gray-400 hover:text-purple-400 hover:border-purple-500/30 transition-all"
              >
                <Eye size={14} /> Preview
              </Link>
              <button
                onClick={() => { setShowAddForm(true); setEditItem(null); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-foreground font-black rounded-xl hover:bg-purple-400 transition-all text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20"
              >
                <Plus size={16} /> Tambah Album
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Album', value: items.length, color: 'text-purple-500' },
              { label: 'Total Foto', value: totalPhotos, color: 'text-blue-500' },
              { label: 'Kategori', value: [...new Set(items.map(i => i.category).filter(Boolean))].length, color: 'text-blue-500' },
            ].map((s) => (
              <div key={s.label} className="p-5 bg-white/5 border border-[var(--border-subtle)] rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Inline Add / Edit Form */}
          {(showAddForm || editItem) && (
            <div className="mb-8 p-8 bg-white/5 border border-purple-500/30 rounded-3xl relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-lg uppercase tracking-tight">
                  {editItem ? `Edit: ${editItem.title}` : 'Tambah Album Baru'}
                </h2>
                <button
                  onClick={() => { setShowAddForm(false); setEditItem(null); }}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-500 hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <GalleryForm
                initialData={editItem || null}
                onSuccess={() => {
                  setShowAddForm(false);
                  setEditItem(null);
                  fetchItems();
                }}
              />
            </div>
          )}

          {/* Filter + Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const count = cat === 'Semua'
                  ? items.length
                  : items.filter((i) => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat
                        ? 'bg-purple-500 text-foreground shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-[var(--border-subtle)]'
                    }`}
                  >
                    {cat} <span className="opacity-60 ml-1">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Sort + View */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[10px] font-bold text-gray-300 focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-background">
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex bg-white/5 border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-all ${viewMode === 'grid' ? 'bg-purple-500 text-foreground' : 'text-gray-500 hover:text-foreground'}`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-all ${viewMode === 'list' ? 'bg-purple-500 text-foreground' : 'text-gray-500 hover:text-foreground'}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Items */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-[var(--border-subtle)]">
              <ImageIcon size={48} className="mx-auto text-gray-800 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                {activeCategory === 'Semua' ? 'Belum ada galeri.' : `Kosong di kategori "${activeCategory}".`}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((item) => {
                const imgs = Array.isArray(item.images) ? item.images : [];
                return (
                  <div
                    key={item.id}
                    className="group bg-white/5 border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden hover:border-purple-500/30 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      {imgs[0] ? (
                        <img src={imgs[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full bg-black/30 flex items-center justify-center text-gray-700">
                          <ImageIcon size={36} />
                        </div>
                      )}
                      {/* Action overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                        <button
                          onClick={() => { setEditItem(item); setShowAddForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="p-3 bg-white text-black rounded-xl hover:scale-110 transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-3 bg-red-500 text-foreground rounded-xl hover:scale-110 transition-all disabled:opacity-50"
                          title="Hapus"
                        >
                          {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${CAT_BADGE[item.category] || 'bg-white/10 border-white/20 text-gray-400'}`}>
                          {item.category}
                        </span>
                      </div>
                      {/* Photo count badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[9px] font-black text-foreground">
                          {imgs.length} foto
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-foreground line-clamp-1 mb-1">{item.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <Calendar size={11} /> {item.date || '—'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List view
            <div className="space-y-3">
              {sorted.map((item) => {
                const imgs = Array.isArray(item.images) ? item.images : [];
                return (
                  <div
                    key={item.id}
                    className="group flex items-center gap-4 p-4 bg-white/5 border border-[var(--border-subtle)] rounded-2xl hover:border-purple-500/30 transition-all"
                  >
                    {/* Thumb */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                      {imgs[0] ? (
                        <img src={imgs[0]} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{item.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${CAT_BADGE[item.category] || 'bg-white/10 border-white/20 text-gray-400'}`}>
                          {item.category}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                          <Calendar size={10} /> {item.date || '—'}
                        </span>
                        <span className="text-[10px] text-purple-500 font-black ml-auto">
                          {imgs.length} foto
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => { setEditItem(item); setShowAddForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-blue-400"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all text-red-400 disabled:opacity-50"
                      >
                        {deletingId === item.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
