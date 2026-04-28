'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import ExportData from '@/components/ExportData';
import {
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  Folders,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Settings,
} from 'lucide-react';

const SECTIONS = [
  {
    key: 'show_about',
    label: 'Tentang',
    desc: 'Section "About Me" di halaman utama',
    icon: <User size={20} className="text-teal-500" />,
  },
  {
    key: 'show_experience',
    label: 'Pengalaman',
    desc: 'Section timeline pengalaman kerja & organisasi',
    icon: <Briefcase size={20} className="text-blue-500" />,
  },
  {
    key: 'show_education',
    label: 'Pendidikan',
    desc: 'Section timeline riwayat pendidikan',
    icon: <GraduationCap size={20} className="text-purple-500" />,
  },
  {
    key: 'show_projects',
    label: 'Proyek',
    desc: 'Section showcase proyek & portfolio',
    icon: <Folders size={20} className="text-orange-500" />,
  },
  {
    key: 'show_blog',
    label: 'Blog',
    desc: 'Section artikel & tulisan terbaru',
    icon: <BookOpen size={20} className="text-green-500" />,
  },
  {
    key: 'show_gallery',
    label: 'Galeri',
    desc: 'Section galeri foto kegiatan',
    icon: <ImageIcon size={20} className="text-pink-500" />,
  },
  {
    key: 'show_contact',
    label: 'Kontak',
    desc: 'Section form kontak & informasi',
    icon: <Mail size={20} className="text-yellow-500" />,
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('SiteSettings').select('*');
      const map = {};
      (data || []).forEach((row) => {
        map[row.key] = row.value;
      });
      // Default semua true kalau belum ada
      SECTIONS.forEach((s) => {
        if (map[s.key] === undefined) map[s.key] = true;
      });
      setSettings(map);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = async () => {
    setSaving(true);
    for (const section of SECTIONS) {
      await supabase
        .from('SiteSettings')
        .upsert(
          { key: section.key, value: settings[section.key], updatedAt: new Date().toISOString() },
          { onConflict: 'key' }
        );
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-teal-500/10 rounded-xl">
                <Settings size={24} className="text-teal-500" />
              </div>
              <h1 className="text-2xl font-bold">Pengaturan Tampilan</h1>
            </div>
            <p className="text-gray-500 text-sm ml-12">
              Pilih section mana yang tampil di halaman utama website.
            </p>
          </header>

          {saved && (
            <div className="flex items-center gap-2 p-4 bg-teal-500 text-black font-bold rounded-2xl mb-6 animate-bounce">
              <CheckCircle2 size={20} /> Pengaturan tersimpan & langsung aktif!
            </div>
          )}

          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center gap-3 p-6 text-gray-500">
                <Loader2 size={20} className="animate-spin" /> Memuat pengaturan...
              </div>
            ) : (
              SECTIONS.map((section) => {
                const isOn = settings[section.key] !== false;
                return (
                  <div
                    key={section.key}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      isOn
                        ? 'bg-white/5 border-[var(--border-subtle)] hover:border-white/20'
                        : 'bg-black/40 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-xl">{section.icon}</div>
                      <div>
                        <p className="font-bold text-sm">{section.label}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{section.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(section.key)}
                      className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
                        isOn ? 'bg-teal-500' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                          isOn ? 'left-8' : 'left-1'
                        }`}
                      />
                      <span className="sr-only">{isOn ? 'Tampil' : 'Tersembunyi'}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* AI Settings Section */}
          {!loading && (
            <div className="mt-8 p-6 bg-white/5 border border-[var(--border-subtle)] rounded-[2rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <User size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-sm">Pelatihan Asisten AI (Chatbot)</p>
                  <p className="text-gray-500 text-xs">Atur kepribadian dan pengetahuan spesifik yang dimiliki oleh Virtual Asisten Anda.</p>
                </div>
              </div>
              <textarea
                value={settings.ai_prompt || 'Kamu adalah Virtual Asisten cerdas untuk portofolio milik Ridho Robbi Pasi (seorang Full Stack Web Developer & UI/UX). Jawab dengan singkat, sopan, dan dalam bahasa Indonesia.'}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, ai_prompt: e.target.value }))
                }
                rows={5}
                className="w-full rounded-xl bg-black/40 border border-[var(--border-subtle)] p-4 text-sm text-gray-300 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="Tuliskan prompt AI Anda di sini..."
              />
            </div>
          )}

          {/* Accent Color Selection */}
          {!loading && (
            <div className="mt-8 p-6 bg-white/5 border border-[var(--border-subtle)] rounded-[2rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: settings.accent_color || '#14b8a6' }}
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">Warna Utama Website</p>
                  <p className="text-gray-500 text-xs">Pilih warna aksen untuk seluruh website</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.accent_color || '#14b8a6'}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, accent_color: e.target.value }))
                  }
                  className="w-full h-12 rounded-xl bg-black/40 border border-[var(--border-subtle)] p-1 cursor-pointer"
                />
                <div className="px-4 py-3 bg-white/5 border border-[var(--border-subtle)] rounded-xl font-mono text-xs text-gray-400">
                  {settings.accent_color || '#14b8a6'}
                </div>
              </div>
            </div>
          )}

          {!loading && (
            <button
              onClick={async () => {
                setSaving(true);
                // Save all toggles
                for (const section of SECTIONS) {
                  await supabase
                    .from('SiteSettings')
                    .upsert(
                      {
                        key: section.key,
                        value: settings[section.key],
                        updatedAt: new Date().toISOString(),
                      },
                      { onConflict: 'key' }
                    );
                }
                // Save accent color separately because it's text
                await supabase
                  .from('SiteSettings')
                  .upsert(
                    {
                      key: 'accent_color',
                      value: settings.accent_color || '#14b8a6',
                      updatedAt: new Date().toISOString(),
                    },
                    { onConflict: 'key' }
                  );
                // Save AI Prompt
                await supabase
                  .from('SiteSettings')
                  .upsert(
                    {
                      key: 'ai_prompt',
                      value: settings.ai_prompt || 'Kamu adalah Virtual Asisten cerdas untuk portofolio milik Ridho Robbi Pasi (seorang Full Stack Web Developer & UI/UX). Jawab dengan singkat, sopan, dan dalam bahasa Indonesia.',
                      updatedAt: new Date().toISOString(),
                    },
                    { onConflict: 'key' }
                  );
                setSaving(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                window.location.reload(); // Reload to apply color change immediately
              }}
              disabled={saving}
              className="mt-8 w-full py-4 bg-teal-500 text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-teal-500/20 uppercase tracking-widest text-sm"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} /> Simpan Pengaturan
                </>
              )}
            </button>
          )}

          {/* Export Data Section */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
            <ExportData />
          </div>
        </div>
      </main>
    </div>
  );
}
