"use client";

import { memo } from "react";
import { TbSearch, TbX } from "react-icons/tb";

interface AdminSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  total: number;
  filtered: number;
}

function AdminSearchBar({
  value,
  onChange,
  placeholder = "Cari...",
  total,
  filtered,
}: AdminSearchBarProps) {
  const isFiltering = value.trim().length > 0;

  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="relative flex-1">
        <TbSearch
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-8 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-blue-600"
        />
        {isFiltering && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <TbX size={14} />
          </button>
        )}
      </div>
      {isFiltering && (
        <span className="flex-shrink-0 text-xs text-neutral-500">
          {filtered} / {total}
        </span>
      )}
    </div>
  );
}

export default memo(AdminSearchBar);
