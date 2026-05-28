"use client";

import { useRef } from "react";
import { 
  FiBold, 
  FiItalic, 
  FiList, 
  FiLink, 
  FiType 
} from "react-icons/fi";
import { AiOutlineOrderedList } from "react-icons/ai";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function MarkdownEditor({ value, onChange, placeholder, rows = 4 }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    
    onChange(newText);

    // Reset cursor position after React re-renders
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleBold = () => insertFormat("**", "**");
  const handleItalic = () => insertFormat("*", "*");
  const handleHeading = () => insertFormat("### ", "");
  const handleUl = () => insertFormat("- ", "");
  const handleOl = () => insertFormat("1. ", "");
  const handleLink = () => insertFormat("[", "](url)");

  return (
    <div className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-blue-500 bg-white dark:bg-neutral-900">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700">
        <button type="button" onClick={handleBold} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors" title="Bold">
          <FiBold size={16} />
        </button>
        <button type="button" onClick={handleItalic} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors" title="Italic">
          <FiItalic size={16} />
        </button>
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <button type="button" onClick={handleHeading} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors" title="Heading">
          <FiType size={16} />
        </button>
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <button type="button" onClick={handleUl} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors" title="Bullet List">
          <FiList size={16} />
        </button>
        <button type="button" onClick={handleOl} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors" title="Numbered List">
          <AiOutlineOrderedList size={16} />
        </button>
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <button type="button" onClick={handleLink} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors" title="Link">
          <FiLink size={16} />
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full p-3 bg-transparent resize-y outline-none font-sans text-sm text-neutral-800 dark:text-neutral-200"
        placeholder={placeholder}
      />
    </div>
  );
}
