"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  TbId,
  TbSeo,
  TbPhone,
  TbSettingsCog,
  TbChevronDown,
  TbUpload,
  TbTrash,
  TbPlus,
  TbExternalLink,
} from "react-icons/tb";

type Setting = { key: string; value: string };

type FieldType = "text" | "textarea" | "logo";

type FieldDef = {
  key: string;
  label: string;
  help: string;
  placeholder?: string;
  type: FieldType;
};

type GroupDef = {
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: FieldDef[];
};

// Pengaturan yang sudah dikenali. Ditampilkan sebagai form berlabel agar mudah.
const GROUPS: GroupDef[] = [
  {
    title: "Identitas Website",
    description: "Nama dan logo yang mewakili brand kamu.",
    icon: <TbId className="h-5 w-5" />,
    fields: [
      {
        key: "site_title",
        label: "Judul Website",
        help: "Nama/brand website kamu. Muncul di judul tab browser & hasil pencarian.",
        placeholder: "Ridho Robbi Pasi",
        type: "text",
      },
      {
        key: "site_logo",
        label: "Logo Website",
        help: "Gambar logo. Dipakai sebagai favicon & ikon situs. Format: PNG/JPG/SVG.",
        type: "logo",
      },
    ],
  },
  {
    title: "SEO",
    description: "Bagaimana website tampil di Google & media sosial.",
    icon: <TbSeo className="h-5 w-5" />,
    fields: [
      {
        key: "seo_description",
        label: "Deskripsi SEO",
        help: "Ringkasan singkat website (±150 karakter). Tampil di bawah judul pada hasil pencarian Google.",
        placeholder: "Web developer & digital consultant...",
        type: "textarea",
      },
    ],
  },
  {
    title: "Kontak",
    description: "Informasi agar pengunjung bisa menghubungi kamu.",
    icon: <TbPhone className="h-5 w-5" />,
    fields: [
      {
        key: "contact_whatsapp",
        label: "Nomor WhatsApp",
        help: "Format internasional tanpa tanda '+', misal: 6281234567890.",
        placeholder: "6281234567890",
        type: "text",
      },
      {
        key: "contact_email",
        label: "Email",
        help: "Alamat email yang bisa dihubungi pengunjung.",
        placeholder: "halo@contoh.com",
        type: "text",
      },
    ],
  },
];

const KNOWN_KEYS = new Set(GROUPS.flatMap((g) => g.fields.map((f) => f.key)));

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  // Bagian Lanjutan (key/value mentah)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-settings");
      if (!res.ok) throw new Error("Gagal mengambil data pengaturan");
      const data = await res.json();
      setSettings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const valueMap = useMemo(() => {
    const m: Record<string, string> = {};
    settings.forEach((s) => (m[s.key] = s.value));
    return m;
  }, [settings]);

  // Key custom yang tidak ada di daftar bawaan -> ditampilkan di Lanjutan
  const customSettings = useMemo(
    () => settings.filter((s) => !KNOWN_KEYS.has(s.key)),
    [settings],
  );

  const handleSave = async (key: string, value: string, opts?: { silent?: boolean }) => {
    const toastId = opts?.silent ? undefined : toast.loading("Menyimpan...");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");
      if (toastId) toast.success("Tersimpan", { id: toastId });
      await fetchSettings();
      if (isAdding) {
        setIsAdding(false);
        setNewKey("");
        setNewValue("");
      }
    } catch (error: any) {
      if (toastId) toast.error(error.message, { id: toastId });
      else toast.error(error.message);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Hapus pengaturan '${key}'?`)) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/site-settings?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleLogoUpload = async (file: File) => {
    const toastId = toast.loading("Mengunggah & menyimpan logo...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", "site-logo");
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal mengunggah gambar logo");
      }
      const uploadData = await uploadRes.json();
      const saveRes = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "site_logo", value: uploadData.url }),
      });
      if (!saveRes.ok) throw new Error("Gagal menyimpan logo ke database");
      toast.success("Logo berhasil diperbarui!", { id: toastId });
      fetchSettings();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Pengaturan Website
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Atur identitas, SEO, dan kontak website kamu di satu tempat. Perubahan tersimpan
          otomatis saat kamu pindah dari kolom isian.
        </p>
      </div>

      {/* Grup pengaturan bawaan */}
      {GROUPS.map((group) => (
        <section
          key={group.title}
          className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <header className="flex items-start gap-3 border-b border-neutral-100 p-5 dark:border-neutral-800">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {group.icon}
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">{group.title}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {group.description}
              </p>
            </div>
          </header>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {group.fields.map((field) => (
              <div key={field.key} className="p-5">
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {field.label}
                </label>
                <p className="mb-2.5 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {field.help}
                </p>

                {field.type === "logo" ? (
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
                      {valueMap[field.key] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={valueMap[field.key]}
                          alt="Logo"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-400">No logo</span>
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
                      <TbUpload className="h-4 w-4" />
                      {valueMap[field.key] ? "Ganti Logo" : "Unggah Logo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    defaultValue={valueMap[field.key] || ""}
                    placeholder={field.placeholder}
                    rows={3}
                    onBlur={(e) => {
                      if (e.target.value !== (valueMap[field.key] || "")) {
                        handleSave(field.key, e.target.value);
                      }
                    }}
                    className="w-full resize-y rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:text-white"
                  />
                ) : (
                  <input
                    type="text"
                    defaultValue={valueMap[field.key] || ""}
                    placeholder={field.placeholder}
                    onBlur={(e) => {
                      if (e.target.value !== (valueMap[field.key] || "")) {
                        handleSave(field.key, e.target.value);
                      }
                    }}
                    className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Bagian Lanjutan */}
      <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <button
          onClick={() => setShowAdvanced((s) => !s)}
          className="flex w-full items-center justify-between gap-3 p-5 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              <TbSettingsCog className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">Lanjutan</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Pengaturan khusus (key/value mentah) untuk pengguna teknis.
                {customSettings.length > 0 && ` ${customSettings.length} tersimpan.`}
              </p>
            </div>
          </div>
          <TbChevronDown
            className={`h-5 w-5 flex-shrink-0 text-neutral-400 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="space-y-4 border-t border-neutral-100 p-5 dark:border-neutral-800">
            {/* Daftar key custom */}
            {customSettings.map((item) => (
              <div
                key={item.key}
                className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-end"
              >
                <div className="w-full sm:w-1/3">
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Key</label>
                  <input
                    type="text"
                    value={item.key}
                    disabled
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950"
                  />
                </div>
                <div className="w-full flex-1">
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Value</label>
                  <input
                    type="text"
                    defaultValue={item.value}
                    onBlur={(e) => {
                      if (e.target.value !== item.value) handleSave(item.key, e.target.value);
                    }}
                    className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => handleDelete(item.key)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/30 dark:text-red-500 dark:hover:bg-red-900/10"
                >
                  <TbTrash className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            ))}

            {/* Form tambah key baru */}
            {isAdding ? (
              <div className="rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-neutral-500">Key</label>
                    <input
                      type="text"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="misal: footer_text"
                      className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-neutral-500">Value</label>
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Nilainya"
                      className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(newKey, newValue)}
                      disabled={!newKey || !newValue}
                      className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setNewKey("");
                        setNewValue("");
                      }}
                      className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <TbPlus className="h-4 w-4" />
                Tambah Pengaturan Khusus
              </button>
            )}

            {customSettings.length === 0 && !isAdding && (
              <p className="text-center text-sm text-neutral-400">
                Belum ada pengaturan khusus.
              </p>
            )}
          </div>
        )}
      </section>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-neutral-400">
        <TbExternalLink className="h-3.5 w-3.5" />
        Logo juga tersedia di <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">/api/logo</code>
      </p>
    </div>
  );
}
