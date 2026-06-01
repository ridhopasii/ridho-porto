/**
 * AdminFormUI.tsx
 * Shared UI primitives used across all admin form modals.
 * Provides consistent styling, color pickers, toggle switches, and modal shells.
 */
"use client";

import React from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
export const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200";

export const labelCls = "mb-1.5 block text-xs font-semibold text-neutral-500 dark:text-neutral-400";

// ─── Color palette ────────────────────────────────────────────────────────────
export const COLOR_OPTIONS = [
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

export const GRADIENT_OPTIONS = [
  { label: "Slate / GitHub",        value: "bg-gradient-to-b from-slate-900 to-slate-950",               from: "#0f172a", to: "#020617" },
  { label: "Red / Gmail",           value: "bg-gradient-to-b from-red-700 to-red-900",                   from: "#b91c1c", to: "#7f1d1d" },
  { label: "Sky / LinkedIn",        value: "bg-gradient-to-b from-sky-700 to-sky-900",                   from: "#0369a1", to: "#0c4a6e" },
  { label: "Purple→Pink→Orange",    value: "bg-gradient-to-b from-purple-700 via-pink-500 to-orange-500",from: "#7e22ce", to: "#f97316" },
  { label: "Neutral / TikTok",      value: "bg-gradient-to-b from-neutral-700 to-neutral-900",           from: "#404040", to: "#171717" },
  { label: "Blue",                  value: "bg-gradient-to-b from-blue-700 to-blue-900",                 from: "#1d4ed8", to: "#1e3a8a" },
  { label: "Indigo",                value: "bg-gradient-to-b from-indigo-700 to-indigo-900",             from: "#4338ca", to: "#312e81" },
  { label: "Violet",                value: "bg-gradient-to-b from-violet-700 to-violet-900",             from: "#6d28d9", to: "#4c1d95" },
  { label: "Green",                 value: "bg-gradient-to-b from-green-700 to-green-900",               from: "#15803d", to: "#14532d" },
  { label: "Teal",                  value: "bg-gradient-to-b from-teal-700 to-teal-900",                 from: "#0f766e", to: "#134e4a" },
  { label: "Orange",                value: "bg-gradient-to-b from-orange-600 to-orange-900",             from: "#ea580c", to: "#7c2d12" },
  { label: "Pink",                  value: "bg-gradient-to-b from-pink-600 to-pink-900",                 from: "#db2777", to: "#831843" },
  { label: "Zinc / Twitter",        value: "bg-gradient-to-b from-zinc-700 to-zinc-950",                 from: "#3f3f46", to: "#09090b" },
];

// ─── Field label + background color options ───────────────────────────────────
export const BG_COLOR_OPTIONS = [
  { label: "Cyan 400",    hex: "#22d3ee", value: "bg-cyan-400" },
  { label: "Blue 500",    hex: "#3b82f6", value: "bg-blue-500" },
  { label: "Indigo 500",  hex: "#6366f1", value: "bg-indigo-500" },
  { label: "Violet 500",  hex: "#8b5cf6", value: "bg-violet-500" },
  { label: "Purple 500",  hex: "#a855f7", value: "bg-purple-500" },
  { label: "Pink 500",    hex: "#ec4899", value: "bg-pink-500" },
  { label: "Rose 500",    hex: "#f43f5e", value: "bg-rose-500" },
  { label: "Red 500",     hex: "#ef4444", value: "bg-red-500" },
  { label: "Orange 500",  hex: "#f97316", value: "bg-orange-500" },
  { label: "Amber 500",   hex: "#f59e0b", value: "bg-amber-500" },
  { label: "Yellow 400",  hex: "#facc15", value: "bg-yellow-400" },
  { label: "Lime 500",    hex: "#84cc16", value: "bg-lime-500" },
  { label: "Green 500",   hex: "#22c55e", value: "bg-green-500" },
  { label: "Emerald 500", hex: "#10b981", value: "bg-emerald-500" },
  { label: "Teal 500",    hex: "#14b8a6", value: "bg-teal-500" },
  { label: "Slate 500",   hex: "#64748b", value: "bg-slate-500" },
  { label: "Neutral 500", hex: "#737373", value: "bg-neutral-500" },
  { label: "White",       hex: "#ffffff", value: "bg-white" },
  ...COLOR_OPTIONS.map(c => ({ label: c.label + " (light)", hex: c.hex, value: c.bg })),
];

// ─── Modal Shell ──────────────────────────────────────────────────────────────
interface ModalShellProps {
  title: string;
  maxWidth?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalShell({ title, maxWidth = "max-w-2xl", onClose, children }: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full ${maxWidth} h-[90vh] sm:h-auto max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl dark:bg-neutral-900 animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 duration-300`}>
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            ✕
          </button>
        </div>
        
        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Form Footer (Save / Cancel buttons) ─────────────────────────────────────
interface FormFooterProps {
  onClose: () => void;
  loading: boolean;
  saveLabel?: string;
}

export function FormFooter({ onClose, loading, saveLabel = "Simpan" }: FormFooterProps) {
  return (
    <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 transition-colors dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Menyimpan..." : saveLabel}
      </button>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

export function ToggleSwitch({ checked, onChange, label, description }: ToggleSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40">
      <div className="relative flex-shrink-0">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`h-5 w-9 rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-neutral-300 dark:bg-neutral-700"}`} />
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-neutral-500">{description}</p>}
      </div>
    </label>
  );
}

// ─── Color Picker (text / bg / border prefix) ─────────────────────────────────
interface ColorPickerProps {
  label: string;
  prefix: "text" | "bg" | "border";
  value: string;
  onChange: (v: string) => void;
}

export function ColorPicker({ label, prefix, value, onChange }: ColorPickerProps) {
  const selected = COLOR_OPTIONS.find(c =>
    prefix === "text" ? c.text === value : prefix === "bg" ? c.bg === value : c.border === value
  );

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 flex-shrink-0 rounded-lg border-2 border-neutral-200 shadow-sm transition-all dark:border-neutral-700"
          style={{ backgroundColor: selected?.hex ?? "#374151" }}
          title={selected?.label ?? value}
        />
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
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

// ─── Background Color Picker (broader palette for backgrounds) ───────────────
interface BgColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export function BgColorPicker({ label, value, onChange }: BgColorPickerProps) {
  const unique = Array.from(new Map(BG_COLOR_OPTIONS.map(c => [c.value, c])).values());
  const selected = unique.find(c => c.value === value);

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 flex-shrink-0 rounded-lg border-2 border-neutral-200 shadow-sm dark:border-neutral-700"
          style={{ backgroundColor: selected?.hex ?? "#374151" }}
        />
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        >
          <option value="">— Pilih warna —</option>
          {unique.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Gradient Picker ──────────────────────────────────────────────────────────
interface GradientPickerProps {
  value: string;
  onChange: (v: string) => void;
}

export function GradientPicker({ value, onChange }: GradientPickerProps) {
  const selected = GRADIENT_OPTIONS.find(g => g.value === value);

  return (
    <div>
      <label className={labelCls}>Background Gradient</label>
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 flex-shrink-0 rounded-lg border-2 border-neutral-200 shadow-sm dark:border-neutral-700"
          style={selected ? { background: `linear-gradient(to bottom, ${selected.from}, ${selected.to})` } : { background: "#374151" }}
        />
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
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

// ─── Color Swatches strip ─────────────────────────────────────────────────────
interface ColorSwatchesProps {
  colors: { label: string; hex?: string; gradient?: { from: string; to: string } }[];
}

export function ColorSwatches({ colors }: ColorSwatchesProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      {colors.map(({ label, hex, gradient }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div
            className="h-5 w-10 rounded border border-neutral-200 dark:border-neutral-700"
            style={
              gradient
                ? { background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})` }
                : { backgroundColor: hex ?? "#374151" }
            }
          />
          <span className="text-[9px] text-neutral-400">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Styling Section wrapper ──────────────────────────────────────────────────
export function StylingSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/20">
      <h4 className="mb-3 text-sm font-bold">🎨 Styling Warna</h4>
      {children}
    </div>
  );
}

// ─── Section divider with title ───────────────────────────────────────────────
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800">
      <h4 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">{children}</h4>
    </div>
  );
}

// ─── Form input helpers ───────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-neutral-400">{hint}</p>}
    </div>
  );
}
