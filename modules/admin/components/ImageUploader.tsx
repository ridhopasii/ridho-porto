"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineUpload, HiX } from "react-icons/hi";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  path?: string;
}

export default function ImageUploader({ value, onChange, label = "Upload Image", path = "uploads" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    setUploading(true);
    const toastId = toast.loading("Converting & Uploading...");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Successfully uploaded and converted to WebP!", { id: toastId });
      onChange(data.url);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => onChange("");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>

      {value ? (
        <div className="relative group w-fit">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
            <img 
              src={value} 
              alt="Uploaded preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                title="Remove image"
              >
                <HiX size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center
            cursor-pointer transition-colors
            ${uploading ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 opacity-50" : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-neutral-500">Uploading...</p>
            </div>
          ) : (
            <>
              <HiOutlineUpload size={32} className="text-neutral-400 mb-2" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Click to upload image
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Any image (Auto-converted to WebP)
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
