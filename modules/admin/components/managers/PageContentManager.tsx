"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  TbSparkles,
  TbUser,
  TbSettingsCog,
  TbChevronDown,
  TbPlus,
  TbExternalLink,
  TbDeviceFloppy,
} from "react-icons/tb";

interface Props {
  page: string;
}

type Locale = "id" | "en";
type FieldType = "text" | "textarea";

type FieldDef = {
  key: string;
  label: string;
  help: string;
  placeholder?: string;
  type: FieldType;
};

type SectionDef = {
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: FieldDef[];
};

type ContentItem = {
  id?: string | number;
  page: string;
  locale: string;
  key: string;
  value: string;
};

// Bagian terstruktur untuk halaman "home" — sesuai yang benar-benar dipakai beranda.
const HOME_SECTIONS: SectionDef[] = [
  {
    title: "Bagian Hero (Sapaan Utama)",
    description: "Teks besar paling atas halaman beranda.",
    icon: <TbSparkles className="h-5 w-5" />,
    fields: [
      {
        key: "intro",
        label: "Headline / Sapaan",
        help: "Judul besar (H1) paling atas beranda. Contoh: 'Halo, saya Ridho 👋'",
        placeholder: "Halo, saya Ridho",
        type: "text",
      },
      {
        key: "hero.prefix_text",
        label: "Kata Awalan",
        help: "Kata sebelum teks animasi berputar. Contoh: 'Seorang' atau 'A'.",
        placeholder: "Seorang",
        type: "text",
      },
      {
        key: "hero.rotating_texts",
        label: "Teks Animasi Berputar",
        help: "Beberapa peran/kata yang berganti otomatis. Pisahkan dengan koma.",
        placeholder: "Web Developer, Desainer UI, Problem Solver",
        type: "textarea",
      },
      {
        key: "hero.suffix_text",
        label: "Kata Akhiran",
        help: "Kata setelah teks animasi (boleh dikosongkan).",
        placeholder: "",
        type: "text",
      },
    ],
  },
  {
    title: "Bio Singkat",
    description: "Paragraf perkenalan di bawah headline.",
    icon: <TbUser className="h-5 w-5" />,
    fields: [
      {
        key: "resume.paragraph_1",
        label: "Bio Paragraf 1",
        help: "Paragraf pertama bio yang tampil di beranda.",
        type: "textarea",
      },
      {
        key: "resume.paragraph_2",
        label: "Bio Paragraf 2",
        help: "Paragraf kedua bio yang tampil di beranda.",
        type: "textarea",
      },
    ],
  },
];

// Bagian terstruktur untuk halaman "about" (judul/subjudul section di halaman Resume).
const ABOUT_SECTIONS: SectionDef[] = [
  {
    title: "Section Karir",
    description: "Judul & subjudul di halaman Karir/Pengalaman.",
    icon: <TbUser className="h-5 w-5" />,
    fields: [
      {
        key: "career.title",
        label: "Judul Section Karir",
        help: "Contoh: 'Pengalaman Kerja'.",
        placeholder: "Pengalaman Kerja",
        type: "text",
      },
      {
        key: "career.sub_title",
        label: "Subjudul Karir",
        help: "Kalimat pendukung di bawah judul.",
        type: "textarea",
      },
    ],
  },
  {
    title: "Section Pendidikan",
    description: "Judul & subjudul di halaman Pendidikan.",
    icon: <TbUser className="h-5 w-5" />,
    fields: [
      {
        key: "education.title",
        label: "Judul Section Pendidikan",
        help: "Contoh: 'Riwayat Pendidikan'.",
        placeholder: "Riwayat Pendidikan",
        type: "text",
      },
      {
        key: "education.sub_title",
        label: "Subjudul Pendidikan",
        help: "Kalimat pendukung di bawah judul.",
        type: "textarea",
      },
    ],
  },
  {
    title: "Section Organisasi",
    description: "Judul & subjudul di halaman Organisasi.",
    icon: <TbUser className="h-5 w-5" />,
    fields: [
      {
        key: "organization.title",
        label: "Judul Section Organisasi",
        help: "Contoh: 'Pengalaman Organisasi'.",
        placeholder: "Pengalaman Organisasi",
        type: "text",
      },
      {
        key: "organization.sub_title",
        label: "Subjudul Organisasi",
        help: "Kalimat pendukung di bawah judul.",
        type: "textarea",
      },
    ],
  },
  {
    title: "Umum",
    description: "Teks bersama yang dipakai beberapa section.",
    icon: <TbSettingsCog className="h-5 w-5" />,
    fields: [
      {
        key: "no_data",
        label: "Teks Saat Data Kosong",
        help: "Muncul bila belum ada data. Contoh: 'Belum ada data.'",
        placeholder: "Belum ada data.",
        type: "text",
      },
    ],
  },
];

const SECTIONS_BY_PAGE: Record<string, SectionDef[]> = {
  home: HOME_SECTIONS,
  about: ABOUT_SECTIONS,
};

// Label & target "Lihat Halaman" per page.
const PAGE_LABELS: Record<string, string> = {
  home: "Beranda",
  about: "Resume",
};

const PAGE_PREVIEW_PATH: Record<string, string> = {
  home: "",
  about: "/karir",
};

const LOCALES: { value: Locale; label: string; flag: string }[] = [
  { value: "id", label: "Indonesia", flag: "🇮🇩" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

export default function PageContentManager({ page }: Props) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState<Locale>("id");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const sections = SECTIONS_BY_PAGE[page] || [];
  const knownKeys = useMemo(
    () => new Set(sections.flatMap((s) => s.fields.map((f) => f.key))),
    [sections],
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/page-content?page=${page}`);
      if (res.ok) setItems(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // value lookup untuk locale aktif
  const valueMap = useMemo(() => {
    const m: Record<string, string> = {};
    items
      .filter((i) => i.locale === activeLocale)
      .forEach((i) => (m[i.key] = i.value));
    return m;
  }, [items, activeLocale]);

  // key custom (di luar skema) untuk locale aktif
  const customItems = useMemo(
    () => items.filter((i) => i.locale === activeLocale && !knownKeys.has(i.key)),
    [items, activeLocale, knownKeys],
  );

  const handleSave = async (key: string, value: string) => {
    if (!key) return;
    const toastId = toast.loading("Menyimpan...");
    try {
      const res = await fetch("/api/admin/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, locale: activeLocale, key, value }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Tersimpan", { id: toastId });
      await fetchData();
      if (isAdding) {
        setIsAdding(false);
        setNewKey("");
        setNewValue("");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan", { id: toastId });
    }
  };

  const renderField = (field: FieldDef) => {
    const current = valueMap[field.key] ?? "";
    const filled = current.trim().length > 0;
    return (
      <div key={field.key} className="p-5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {field.label}
          </label>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              filled
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
            }`}
          >
            {filled ? "Terisi" : "Pakai default"}
          </span>
        </div>
        <p className="mb-2.5 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {field.help}{" "}
          <code className="text-[10px] text-neutral-400">({field.key})</code>
        </p>
        {field.type === "textarea" ? (
          <textarea
            defaultValue={current}
            key={`${activeLocale}:${field.key}`}
            placeholder={field.placeholder}
            rows={3}
            onBlur={(e) => {
              if (e.target.value !== current) handleSave(field.key, e.target.value);
            }}
            className="w-full resize-y rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:text-white"
          />
        ) : (
          <input
            type="text"
            defaultValue={current}
            key={`${activeLocale}:${field.key}`}
            placeholder={field.placeholder}
            onBlur={(e) => {
              if (e.target.value !== current) handleSave(field.key, e.target.value);
            }}
            className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:text-white"
          />
        )}
      </div>
    );
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
    <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Konten {PAGE_LABELS[page] || page}
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Ubah teks yang tampil di halaman. Perubahan tersimpan otomatis & langsung
            terlihat di website.
          </p>
        </div>
        <a
          href={`/${activeLocale}${PAGE_PREVIEW_PATH[page] ?? ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <TbExternalLink className="h-4 w-4" />
          Lihat Halaman
        </a>
      </div>

      {/* Tab bahasa */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-neutral-400">Bahasa:</span>
        <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
          {LOCALES.map((loc) => (
            <button
              key={loc.value}
              onClick={() => setActiveLocale(loc.value)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                activeLocale === loc.value
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              {loc.flag} {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bagian terstruktur */}
      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <header className="flex items-start gap-3 border-b border-neutral-100 p-5 dark:border-neutral-800">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {section.icon}
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">
                {section.title}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {section.description}
              </p>
            </div>
          </header>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {section.fields.map(renderField)}
          </div>
        </section>
      ))}

      {/* Bagian Lainnya / custom */}
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
              <h2 className="font-semibold text-neutral-900 dark:text-white">Lainnya</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Konten khusus (key/value bebas) untuk locale{" "}
                <span className="font-medium uppercase">{activeLocale}</span>.
                {customItems.length > 0 && ` ${customItems.length} tersimpan.`}
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
            {customItems.map((item) => (
              <div
                key={item.key}
                className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <label className="mb-1 block font-mono text-xs font-medium text-neutral-500">
                  {item.key}
                </label>
                <textarea
                  defaultValue={item.value}
                  rows={2}
                  onBlur={(e) => {
                    if (e.target.value !== item.value) handleSave(item.key, e.target.value);
                  }}
                  className="w-full resize-y rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
                />
              </div>
            ))}

            {isAdding ? (
              <div className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">
                    Key
                  </label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="misal: hero.suffix_text"
                    className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">
                    Value
                  </label>
                  <textarea
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    rows={2}
                    placeholder="Isi konten"
                    className="w-full resize-y rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(newKey, newValue)}
                    disabled={!newKey || !newValue}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black"
                  >
                    <TbDeviceFloppy className="h-4 w-4" />
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
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <TbPlus className="h-4 w-4" />
                Tambah Konten Khusus
              </button>
            )}

            {customItems.length === 0 && !isAdding && (
              <p className="text-center text-sm text-neutral-400">
                Belum ada konten khusus untuk bahasa ini.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
