"use client";

import React from "react";

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

interface SegmentedTabsProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedTabsProps<T>) {
  return (
    <div
      className={`w-full rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800 ${className}`}
    >
      <div
        className="relative grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                isActive
                  ? "text-neutral-800 dark:text-neutral-100"
                  : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              }`}
            >
              {isActive ? (
                <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700" />
              ) : null}
              <span className="relative z-10 flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
