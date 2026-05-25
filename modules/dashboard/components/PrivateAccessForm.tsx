"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface PrivateAccessFormProps {
  onSuccess: () => void;
  buttonLabel?: string;
}

export default function PrivateAccessForm({
  onSuccess,
  buttonLabel = "Masuk",
}: PrivateAccessFormProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Mengecek akses...");

    try {
      const res = await fetch("/api/private-dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Akses ditolak");
      }

      toast.success("Akses dibuka", { id: toastId });
      setPassword("");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Gagal masuk", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50"
          placeholder="Masukkan password private hub"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white"
      >
        {loading ? "Membuka..." : buttonLabel}
      </button>
    </form>
  );
}
