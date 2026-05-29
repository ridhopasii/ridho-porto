"use client";

import { memo } from "react";
import { TbTrash, TbX } from "react-icons/tb";

interface AdminBulkBarProps {
  selectedCount: number;
  onDelete: () => void;
  onClear: () => void;
  isDeleting?: boolean;
}

function AdminBulkBar({
  selectedCount,
  onDelete,
  onClear,
  isDeleting = false,
}: AdminBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 dark:border-blue-800 dark:bg-blue-900/20">
      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
        {selectedCount} item dipilih
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40"
        >
          <TbX size={13} />
          Batalkan
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <TbTrash size={13} />
          {isDeleting ? "Menghapus..." : `Hapus ${selectedCount}`}
        </button>
      </div>
    </div>
  );
}

export default memo(AdminBulkBar);
