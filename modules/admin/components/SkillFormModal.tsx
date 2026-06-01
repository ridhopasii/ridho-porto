"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ModalShell, FormFooter, ToggleSwitch, ColorPicker, BgColorPicker, StylingSection, ColorSwatches, Field, inputCls, labelCls, COLOR_OPTIONS } from "./AdminFormUI";

interface SkillFormModalProps {
  skill: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const SKILL_CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Design", "Mobile", "AI/ML", "Other"];

export default function SkillFormModal({ skill, onClose, onSuccess }: SkillFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    background: "",
    color: "",
    category: "",
    level: "Expert",
    percentage: 100,
    is_active: true,
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        icon: skill.icon || "",
        background: skill.background || "",
        color: skill.color || "",
        category: skill.category || "",
        level: skill.level || "Expert",
        percentage: skill.percentage || 100,
        is_active: skill.is_active ?? true,
      });
    }
  }, [skill]);

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Menyimpan...");
    try {
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        showOnHome: formData.is_active,
      };
      const res = await fetch("/api/admin/skills", {
        method: skill ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skill ? { id: skill.id, ...payload } : payload),
      });
      if (res.ok) {
        toast.success("Berhasil disimpan!", { id: toastId });
        onSuccess();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.error}`, { id: toastId });
      }
    } catch {
      toast.error("Failed to save", { id: toastId });
    }
    setLoading(false);
  };

  const textSelected = COLOR_OPTIONS.find(c => c.text === formData.color);
  const bgSelected = COLOR_OPTIONS.find(c => c.bg === formData.background);

  return (
    <ModalShell title={skill ? "Edit Keahlian" : "Tambah Keahlian"} maxWidth="max-w-lg" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nama Skill" required>
            <input required value={formData.name} onChange={e => set("name", e.target.value)} className={inputCls} placeholder="e.g. React.js" />
          </Field>
          <Field label="Icon (react-icons)" required hint="Nama komponen: SiReact, FaNodeJs, dll.">
            <input required value={formData.icon} onChange={e => set("icon", e.target.value)} className={inputCls} placeholder="e.g. SiReact" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Kategori">
            <select value={formData.category} onChange={e => set("category", e.target.value)} className={inputCls}>
              <option value="">— Pilih kategori —</option>
              {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Level">
            <select value={formData.level} onChange={e => set("level", e.target.value)} className={inputCls}>
              {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>

        <Field label={`Persentase: ${formData.percentage}%`}>
          <input
            type="range" min={0} max={100}
            value={formData.percentage}
            onChange={e => set("percentage", Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </Field>

        <StylingSection>
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="Text Color" prefix="text" value={formData.color} onChange={v => set("color", v)} />
            <ColorPicker label="Background Color" prefix="bg" value={formData.background} onChange={v => set("background", v)} />
          </div>
          {/* Live swatch preview */}
          <div className="mt-3 flex items-center gap-3">
            <ColorSwatches colors={[
              { label: "Text", hex: textSelected?.hex },
              { label: "BG",   hex: bgSelected?.hex },
            ]} />
            {/* Mini badge preview */}
            {(formData.color || formData.background) && (
              <div
                className="ml-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: bgSelected?.hex ?? "#374151",
                  color: textSelected?.hex ?? "#ffffff",
                }}
              >
                <span>●</span> {formData.name || "Skill"}
              </div>
            )}
          </div>
        </StylingSection>

        <ToggleSwitch
          checked={formData.is_active}
          onChange={v => set("is_active", v)}
          label={formData.is_active ? "Aktif" : "Nonaktif"}
          description="Tampilkan di halaman beranda & skills"
        />

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Keahlian" />
      </form>
    </ModalShell>
  );
}
