"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface SocialFormModalProps {
  social: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

// ── Tailwind color palette options ──────────────────────────────────────────
const COLOR_OPTIONS = [
  { label: "Slate 300",   hex: "#94a3b8", text: "text-slate-300",   bg: "bg-slate-300",   border: "border-slate-300" },
  { label: "Slate 400",   hex: "#64748b", text: "text-slate-400",   bg: "bg-slate-400",   border: "border-slate-400" },
  { label: "Red 300",     hex: "#fca5a5", text: "text-red-300",     bg: "bg-red-300",     border: "border-red-300" },
  { label: "Red 400",     hex: "#f87171", text: "text-red-400",     bg: "bg-red-400",     border: "border-red-400" },
  { label: "Orange 300",  hex: "#fdba74", text: "text-orange-300",  bg: "bg-orange-300",  border: "border-orange-300" },
  { label: "Amber 300",   hex: "#fcd34d", text: "text-amber-300",   bg: "bg-amber-300",   border: "border-amber-300" },
  { label: "Yellow 300",  hex: "#fde047", text: "text-yellow-300",  bg: "bg-yellow-300",  border: "border-yellow-300" },
  { label: "Lime 300",    hex: "#bef264", text: "text-lime-300",    bg: "bg-lime-300",    border: "border-lime-300" },
  { label: "Green 300",   hex: "#86efac", text: "text-green-300",   bg: "bg-green-300",   border: "border-green-300" },
  { label: "Emerald 300", hex: "#6ee7b7", text: "text-emerald-300", bg: "bg-emerald-300", border: "border-emerald-300" },
  { label: "Teal 300",    hex: "#5eead4", text: "text-teal-300",    bg: "bg-teal-300",    border: "border-teal-300" },
  { label: "Cyan 300",    hex: "#67e8f9", text: "text-cyan-300",    bg: "bg-cyan-300",    border: "border-cyan-300" },
  { label: "Sky 300",     hex: "#7dd3fc", text: "text-sky-300",     bg: "bg-sky-300",     border: "border-sky-300" },
  { label: "Blue 300",    hex: "#93c5fd", text: "text-blue-300",    bg: "bg-blue-300",    border: "border-blue-300" },
  { label: "Indigo 300",  hex: "#a5b4fc", text: "text-indigo-300",  bg: "bg-indigo-300",  border: "border-indigo-300" },
  { label: "Violet 300",  hex: "#c4b5fd", text: "text-violet-300",  bg: "bg-violet-300",  border: "border-violet-300" },
  { label: "Purple 200",  hex: "#e9d5ff", text: "text-purple-200",  bg: "bg-purple-200",  border: "border-purple-200" },
  { label: "Purple 300",  hex: "#d8b4fe", text: "text-purple-300",  bg: "bg-purple-300",  border: "border-purple-300" },
  { label: "Pink 300",    hex: "#f9a8d4", text: "text-pink-300",    bg: "bg-pink-300",    border: "border-pink-300" },
  { label: "Rose 300",    hex: "#fda4af", text: "text-rose-300",    bg: "bg-rose-300",    border: "border-rose-300" },
  { label: "Neutral 300", hex: "#d4d4d4", text: "text-neutral-300", bg: "bg-neutral-300", border: "border-neutral-300" },
  { label: "Neutral 400", hex: "#a3a3a3", text: "text-neutral-400", bg: "bg-neutral-400", border: "border-neutral-400" },
  { label: "White",       hex: "#ffffff", text: "text-white",       bg: "bg-white",       border: "border-white" },
];

const GRADIENT_OPTIONS = [
  { label: "Slate (GitHub)",       value: "bg-gradient-to-b from-slate-900 to-slate-950",              from: "#0f172a", to: "#020617" },
  { label: "Red (Gmail)",          value: "bg-gradient-to-b from-red-700 to-red-900",                  from: "#b91c1c", to: "#7f1d1d" },
  { label: "Sky (LinkedIn)",       value: "bg-gradient-to-b from-sky-700 to-sky-900",                  from: "#0369a1", to: "#0c4a6e" },
  { label: "Purple→Pink→Orange",   value: "bg-gradient-to-b from-purple-700 via-pink-500 to-orange-500", from: "#7e22ce", to: "#f97316" },
  { label: "Neutral (TikTok)",     value: "bg-gradient-to-b from-neutral-700 to-neutral-900",          from: "#404040", to: "#171717" },
  { label: "Blue",                 value: "bg-gradient-to-b from-blue-700 to-blue-900",                from: "#1d4ed8", to: "#1e3a8a" },
  { label: "Indigo",               value: "bg-gradient-to-b from-indigo-700 to-indigo-900",            from: "#4338ca", to: "#312e81" },
  { label: "Violet",               value: "bg-gradient-to-b from-violet-700 to-violet-900",            from: "#6d28d9", to: "#4c1d95" },
  { label: "Green",                value: "bg-gradient-to-b from-green-700 to-green-900",              from: "#15803d", to: "#14532d" },
  { label: "Teal",                 value: "bg-gradient-to-b from-teal-700 to-teal-900",                from: "#0f766e", to: "#134e4a" },
  { label: "Orange",               value: "bg-gradient-to-b from-orange-600 to-orange-900",            from: "#ea580c", to: "#7c2d12" },
  { label: "Pink",                 value: "bg-gradient-to-b from-pink-600 to-pink-900",                from: "#db2777", to: "#831843" },
  { label: "Zinc",                 value: "bg-gradient-to-b from-zinc-700 to-zinc-950",                from: "#3f3f46", to: "#09090b" },
];

const COL_SPAN_OPTIONS = [
  { label: "Normal (1 kolom)",    value: "" },
  { label: "Lebar (2 kolom)",     value: "md:col-span-2" },
  { label: "Penuh (3 kolom)",     value: "md:col-span-3" },
];

// Platform presets – auto-fill when user picks from dropdown
const PLATFORM_PRESETS: Record<string, Partial<typeof initialForm>> = {
  github:    { title: "Explore the Code",          description: "Explore the source code for all my projects on GitHub.",         icon: "BsGithub",    text_color: "text-slate-400",   background_color: "bg-slate-400",   border_color: "border-slate-400",   background_gradient_color: "bg-gradient-to-b from-slate-900 to-slate-950" },
  gmail:     { title: "Stay in Touch",             description: "Reach out via email for any inquiries or collaborations.",        icon: "SiGmail",     text_color: "text-red-300",     background_color: "bg-red-300",     border_color: "border-red-300",     background_gradient_color: "bg-gradient-to-b from-red-700 to-red-900",     col_span: "md:col-span-2" },
  instagram: { title: "Follow My Journey",         description: "Stay updated with my latest posts and stories on Instagram.",    icon: "BsInstagram", text_color: "text-purple-200",  background_color: "bg-purple-200",  border_color: "border-purple-200",  background_gradient_color: "bg-gradient-to-b from-purple-700 via-pink-500 to-orange-500" },
  linkedin:  { title: "Let's Connect",             description: "Connect for collaboration or explore my professional experience.", icon: "BsLinkedin",  text_color: "text-sky-300",     background_color: "bg-sky-300",     border_color: "border-sky-300",     background_gradient_color: "bg-gradient-to-b from-sky-700 to-sky-900" },
  tiktok:    { title: "Join the Fun",              description: "Follow me on TikTok for entertaining and engaging content.",     icon: "BsTiktok",    text_color: "text-neutral-400", background_color: "bg-neutral-400", border_color: "border-neutral-400", background_gradient_color: "bg-gradient-to-b from-neutral-700 to-neutral-900" },
  twitter:   { title: "Follow on Twitter/X",       description: "Follow me for updates, thoughts and quick insights.",             icon: "BsTwitterX",  text_color: "text-slate-300",   background_color: "bg-slate-300",   border_color: "border-slate-300",   background_gradient_color: "bg-gradient-to-b from-zinc-700 to-zinc-950" },
  facebook:  { title: "Find Me on Facebook",       description: "Connect with me on Facebook.",                                    icon: "BsFacebook",  text_color: "text-blue-300",    background_color: "bg-blue-300",    border_color: "border-blue-300",    background_gradient_color: "bg-gradient-to-b from-blue-700 to-blue-900" },
  youtube:   { title: "Watch My Content",          description: "Subscribe to my YouTube channel for videos and tutorials.",       icon: "BsYoutube",   text_color: "text-red-400",     background_color: "bg-red-400",     border_color: "border-red-400",     background_gradient_color: "bg-gradient-to-b from-red-700 to-red-900" },
  whatsapp:  { title: "Chat on WhatsApp",          description: "Message me directly on WhatsApp.",                                icon: "BsWhatsapp",  text_color: "text-green-300",   background_color: "bg-green-300",   border_color: "border-green-300",   background_gradient_color: "bg-gradient-to-b from-green-700 to-green-900" },
};

const initialForm = {
  title: "", description: "", name: "", url: "", icon: "",
  text_color: "", background_color: "", border_color: "",
  background_gradient_color: "", col_span: "", is_show: true,
};

// ── Color Picker with swatch ─────────────────────────────────────────────────
function ColorPicker({ label, prefix, value, onChange }: {
  label: string; prefix: "text" | "bg" | "border"; value: string; onChange: (v: string) => void;
}) {
  const selected = COLOR_OPTIONS.find(c =>
    prefix === "text" ? c.text === value : prefix === "bg" ? c.bg === value : c.border === value
  );

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-neutral-500 dark:text-neutral-400">{label}</label>
      <div className="relative flex items-center gap-2">
        {/* Color swatch */}
        <div
          className="h-8 w-8 flex-shrink-0 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-sm transition-all"
          style={{ backgroundColor: selected?.hex ?? (value ? "transparent" : "#374151") }}
          title={selected?.label ?? value}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        >
          <option value="">— Pilih warna —</option>
          {COLOR_OPTIONS.map(c => (
            <option key={c.text} value={prefix === "text" ? c.text : prefix === "bg" ? c.bg : c.border}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ── Gradient Picker ───────────────────────────────────────────────────────────
function GradientPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const selected = GRADIENT_OPTIONS.find(g => g.value === value);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-neutral-500 dark:text-neutral-400">Background Gradient</label>
      <div className="relative flex items-center gap-2">
        <div
          className="h-8 w-8 flex-shrink-0 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-sm"
          style={selected ? { background: `linear-gradient(to bottom, ${selected.from}, ${selected.to})` } : { background: "#374151" }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        >
          <option value="">— Pilih gradient —</option>
          {GRADIENT_OPTIONS.map(g => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ── Live Card Preview ─────────────────────────────────────────────────────────
function CardPreview({ formData }: { formData: typeof initialForm }) {
  const gradientSelected = GRADIENT_OPTIONS.find(g => g.value === formData.background_gradient_color);
  const textSelected = COLOR_OPTIONS.find(c => c.text === formData.text_color);

  const gradientStyle = gradientSelected
    ? { background: `linear-gradient(to bottom, ${gradientSelected.from}, ${gradientSelected.to})` }
    : { background: "#1e293b" };

  return (
    <div className="mt-4 rounded-xl border border-dashed border-neutral-300 p-3 dark:border-neutral-700">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Preview Card</p>
      <div
        className="relative overflow-hidden rounded-xl border p-4"
        style={{
          ...gradientStyle,
          borderColor: textSelected?.hex ?? "#64748b",
        }}
      >
        <div className="flex flex-col gap-1">
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: textSelected?.hex ?? "#94a3b8" }}
          >
            {formData.name || "platform"}
          </span>
          <p className="text-sm font-bold text-white">{formData.title || "Title"}</p>
          <p className="text-xs text-neutral-400 line-clamp-1">{formData.description || "Description..."}</p>
          <span className="mt-1 text-[10px] font-mono text-neutral-500">{formData.icon || "Icon"}</span>
        </div>
        {/* Glow effect */}
        {textSelected && (
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl"
            style={{ backgroundColor: textSelected.hex }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function SocialFormModal({ social, onClose, onSuccess }: SocialFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (social) {
      setFormData({
        title: social.title || "",
        description: social.description || "",
        name: social.name || "",
        url: social.url || "",
        icon: social.icon || "",
        text_color: social.text_color || "",
        background_color: social.background_color || "",
        border_color: social.border_color || "",
        background_gradient_color: social.background_gradient_color || "",
        col_span: social.col_span || "",
        is_show: social.is_show ?? true,
      });
    } else {
      setFormData(initialForm);
    }
  }, [social]);

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  // When platform preset is selected, auto-fill all styling fields
  const applyPreset = (name: string) => {
    const preset = PLATFORM_PRESETS[name.toLowerCase()];
    set("name", name);
    if (preset) {
      setFormData(prev => ({ ...prev, name, ...preset }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Menyimpan...");

    try {
      const payload = { ...formData, platform: formData.name };
      const res = await fetch("/api/admin/social", {
        method: social ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(social ? { id: social.id, ...payload } : payload),
      });

      if (res.ok) {
        toast.success("Berhasil disimpan!", { id: toastId });
        onSuccess();
      } else {
        const err = await res.json();
        toast.error(err.error || "Gagal menyimpan", { id: toastId });
      }
    } catch {
      toast.error("Failed to save", { id: toastId });
    }
    setLoading(false);
  };

  const inputCls = "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-bold">{social ? "Edit Sosial Media" : "Tambah Sosial Media"}</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          {/* Platform quick-select */}
          {!social && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
              <p className="mb-2 text-xs font-semibold text-neutral-500">⚡ Auto-isi dari Preset Platform</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PLATFORM_PRESETS).map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => applyPreset(name)}
                    className={`rounded-lg border px-3 py-1 text-xs font-medium transition-all ${
                      formData.name === name
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-neutral-200 bg-white hover:border-blue-400 hover:text-blue-600 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-500">Title *</label>
              <input required value={formData.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="e.g. Stay in Touch" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-500">Platform ID (name) *</label>
              <input required value={formData.name} onChange={e => set("name", e.target.value)} className={inputCls} placeholder="e.g. gmail, github" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-neutral-500">Description *</label>
              <input required value={formData.description} onChange={e => set("description", e.target.value)} className={inputCls} placeholder="Short description..." />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-neutral-500">Target URL *</label>
              <input required value={formData.url} onChange={e => set("url", e.target.value)} className={inputCls} placeholder="https://..." />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-500">React Icon Name *</label>
              <input required value={formData.icon} onChange={e => set("icon", e.target.value)} className={inputCls} placeholder="e.g. BsGithub, SiGmail" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-500">Lebar Kolom</label>
              <select value={formData.col_span} onChange={e => set("col_span", e.target.value)} className={inputCls}>
                {COL_SPAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Styling section */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/20">
            <h4 className="mb-3 text-sm font-bold">🎨 Styling Warna</h4>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Text Color"
                prefix="text"
                value={formData.text_color}
                onChange={v => set("text_color", v)}
              />
              <ColorPicker
                label="Background Color"
                prefix="bg"
                value={formData.background_color}
                onChange={v => set("background_color", v)}
              />
              <ColorPicker
                label="Border Color"
                prefix="border"
                value={formData.border_color}
                onChange={v => set("border_color", v)}
              />
              <GradientPicker
                value={formData.background_gradient_color}
                onChange={v => set("background_gradient_color", v)}
              />
            </div>

            {/* All 4 color swatches side by side */}
            <div className="mt-3 flex items-center gap-2">
              {[
                { label: "Text", hex: COLOR_OPTIONS.find(c => c.text === formData.text_color)?.hex },
                { label: "BG",   hex: COLOR_OPTIONS.find(c => c.bg   === formData.background_color)?.hex },
                { label: "Border", hex: COLOR_OPTIONS.find(c => c.border === formData.border_color)?.hex },
              ].map(({ label, hex }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="h-5 w-10 rounded border border-neutral-200 dark:border-neutral-700" style={{ backgroundColor: hex ?? "#374151" }} />
                  <span className="text-[9px] text-neutral-400">{label}</span>
                </div>
              ))}
              {(() => {
                const g = GRADIENT_OPTIONS.find(g => g.value === formData.background_gradient_color);
                return g ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-5 w-16 rounded border border-neutral-200 dark:border-neutral-700" style={{ background: `linear-gradient(to right, ${g.from}, ${g.to})` }} />
                    <span className="text-[9px] text-neutral-400">Gradient</span>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Live card preview */}
            <CardPreview formData={formData} />
          </div>

          {/* Visibility toggle */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={formData.is_show} onChange={e => set("is_show", e.target.checked)} />
              <div className={`h-5 w-9 rounded-full transition-colors ${formData.is_show ? "bg-blue-500" : "bg-neutral-300 dark:bg-neutral-700"}`} />
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${formData.is_show ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <div>
              <p className="text-sm font-medium">{formData.is_show ? "Aktif" : "Disembunyikan"}</p>
              <p className="text-xs text-neutral-500">Tampilkan di halaman kontak</p>
            </div>
          </label>

          {/* Footer actions */}
          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
              Batal
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
