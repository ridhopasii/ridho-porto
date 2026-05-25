"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

const passwordFields = [
  {
    key: "admin_password_hash",
    title: "Admin Password",
    description: "Password untuk masuk ke panel admin.",
    placeholder: "Masukkan password admin baru",
  },
  {
    key: "private_dashboard_password_hash",
    title: "Private Hub Password",
    description: "Password untuk membuka dashboard produktif dan keuangan.",
    placeholder: "Masukkan password private hub baru",
  },
];

export default function SecurityManager() {
  const [adminPassword, setAdminPassword] = useState("");
  const [privatePassword, setPrivatePassword] = useState("");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const savePassword = async (key: string, password: string) => {
    setLoadingKey(key);
    const toastId = toast.loading("Menyimpan password...");

    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Gagal menyimpan");
      }

      toast.success("Password berhasil diperbarui", { id: toastId });

      if (key === "admin_password_hash") {
        setAdminPassword("");
      } else {
        setPrivatePassword("");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan", { id: toastId });
    } finally {
      setLoadingKey(null);
    }
  };

  const renderField = (
    field: (typeof passwordFields)[number],
    value: string,
    setValue: (value: string) => void,
  ) => (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
        Security
      </p>
      <h3 className="mt-2 text-lg font-bold text-neutral-950 dark:text-white">
        {field.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        {field.description}
      </p>

      <div className="mt-4 space-y-3">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={field.placeholder}
          className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700"
        />

        <button
          type="button"
          onClick={() => savePassword(field.key, value)}
          disabled={loadingKey === field.key || !value.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white"
        >
          {loadingKey === field.key ? "Menyimpan..." : "Simpan Password"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {renderField(
        passwordFields[0],
        adminPassword,
        setAdminPassword,
      )}
      {renderField(
        passwordFields[1],
        privatePassword,
        setPrivatePassword,
      )}
    </div>
  );
}
