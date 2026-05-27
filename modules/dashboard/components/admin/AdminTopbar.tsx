"use client";

import { TbSearch, TbBell, TbHelp } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

export default function AdminTopbar() {
  return (
    <header className="fixed top-0 left-[256px] right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-800 flex justify-between items-center px-8 z-40">
      <div className="flex items-center gap-8 w-1/2">
        <div className="relative w-full max-w-md">
          <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-transparent focus:bg-[#121212] focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 rounded-lg text-sm text-neutral-200 transition-all placeholder:text-neutral-500 outline-none" 
            placeholder="Search resources..." 
            type="text" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          target="_blank"
          className="text-neutral-400 px-4 py-2 text-[11px] font-semibold hover:text-neutral-200 transition-colors uppercase tracking-widest"
        >
          View Site
        </Link>
        
        <div className="flex items-center gap-2 pr-4 border-r border-neutral-800">
          <button className="p-2 text-neutral-400 hover:bg-neutral-900 rounded-lg transition-all">
            <TbBell size={20} />
          </button>
          <button className="p-2 text-neutral-400 hover:bg-neutral-900 rounded-lg transition-all">
            <TbHelp size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-semibold text-neutral-200 leading-none">Ridho</p>
            <p className="text-[11px] text-neutral-500 leading-none mt-1">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full border border-neutral-700 overflow-hidden shadow-sm">
            <Image 
              src="/profile.webp" 
              alt="Admin User Profile" 
              width={36} 
              height={36} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
