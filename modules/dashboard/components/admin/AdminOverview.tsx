import React from "react";
import { TbFolder, TbArticle, TbBook, TbEye, TbTrendingUp, TbDotsCircleHorizontal } from "react-icons/tb";
import Image from "next/image";

export default function AdminOverview() {
  return (
    <div className="p-admin-xl max-w-[1600px] mx-auto min-h-screen">
      {/* HEADER & BREADCRUMB */}
      <header className="mb-admin-xl flex flex-col gap-admin-xs">
        <nav className="flex items-center gap-admin-sm text-admin-label-caps font-admin-label-caps text-admin-outline dark:text-neutral-400">
          <a className="hover:text-admin-primary" href="#">Admin</a>
          <span className="text-[12px]">{'>'}</span>
          <span className="text-admin-primary font-bold">Overview</span>
        </nav>
        <h2 className="font-admin-display-lg text-admin-display-lg text-admin-on-surface dark:text-white">Welcome back, Ridho.</h2>
        <p className="text-admin-on-surface-variant dark:text-neutral-400 font-admin-body-md">Here is what's happening with your workspace today.</p>
      </header>
      
      <div className="grid grid-cols-12 gap-admin-xl">
        {/* LEFT CONTENT (STATS & CHARTS) */}
        <div className="col-span-12 lg:col-span-8 space-y-admin-xl">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-admin-lg">
            {/* Total Proyek */}
            <div className="bg-admin-surface dark:bg-[#111111] p-admin-lg rounded-xl border border-admin-outline-variant dark:border-neutral-800 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-admin-primary/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-center justify-between mb-admin-md">
                <div className="p-2 bg-admin-primary-container/10 text-admin-primary rounded-lg group-hover:bg-admin-primary group-hover:text-white transition-colors">
                  <TbFolder size={24} />
                </div>
                <span className="text-admin-success-accent bg-admin-success-accent/10 px-admin-xs py-[2px] rounded text-[10px] font-bold">+12%</span>
              </div>
              <p className="text-admin-outline dark:text-neutral-400 font-admin-label-caps text-admin-label-caps uppercase">Total Proyek</p>
              <p className="text-admin-display-lg font-admin-display-lg text-admin-on-surface dark:text-white mt-admin-xs">10</p>
            </div>
            {/* Total Artikel */}
            <div className="bg-admin-surface dark:bg-[#111111] p-admin-lg rounded-xl border border-admin-outline-variant dark:border-neutral-800 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-admin-tertiary/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-center justify-between mb-admin-md">
                <div className="p-2 bg-admin-tertiary-container/10 text-admin-tertiary rounded-lg group-hover:bg-admin-tertiary group-hover:text-white transition-colors">
                  <TbArticle size={24} />
                </div>
                <span className="text-admin-success-accent bg-admin-success-accent/10 px-admin-xs py-[2px] rounded text-[10px] font-bold">+5%</span>
              </div>
              <p className="text-admin-outline dark:text-neutral-400 font-admin-label-caps text-admin-label-caps uppercase">Total Artikel</p>
              <p className="text-admin-display-lg font-admin-display-lg text-admin-on-surface dark:text-white mt-admin-xs">7</p>
            </div>
            {/* Pesan Buku Tamu */}
            <div className="bg-admin-surface dark:bg-[#111111] p-admin-lg rounded-xl border border-admin-outline-variant dark:border-neutral-800 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-admin-secondary/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-center justify-between mb-admin-md">
                <div className="p-2 bg-admin-secondary-container/10 text-admin-secondary rounded-lg group-hover:bg-admin-secondary group-hover:text-white transition-colors">
                  <TbBook size={24} />
                </div>
                <span className="text-admin-outline dark:text-neutral-400 bg-admin-outline-variant/20 px-admin-xs py-[2px] rounded text-[10px] font-bold">0%</span>
              </div>
              <p className="text-admin-outline dark:text-neutral-400 font-admin-label-caps text-admin-label-caps uppercase">Pesan Buku Tamu</p>
              <p className="text-admin-display-lg font-admin-display-lg text-admin-on-surface dark:text-white mt-admin-xs">0</p>
            </div>
            {/* Total Kunjungan */}
            <div className="bg-admin-surface dark:bg-[#111111] p-admin-lg rounded-xl border border-admin-outline-variant dark:border-neutral-800 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-admin-primary/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-center justify-between mb-admin-md">
                <div className="p-2 bg-admin-primary-container/10 text-admin-primary rounded-lg group-hover:bg-admin-primary group-hover:text-white transition-colors">
                  <TbEye size={24} />
                </div>
                <span className="text-admin-success-accent bg-admin-success-accent/10 px-admin-xs py-[2px] rounded text-[10px] font-bold">+28%</span>
              </div>
              <p className="text-admin-outline dark:text-neutral-400 font-admin-label-caps text-admin-label-caps uppercase">Total Kunjungan</p>
              <p className="text-admin-display-lg font-admin-display-lg text-admin-on-surface dark:text-white mt-admin-xs">24.5K</p>
            </div>
          </div>

          {/* MAIN CHART */}
          <section className="bg-admin-surface dark:bg-[#111111] border border-admin-outline-variant dark:border-neutral-800 rounded-xl p-admin-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-admin-md mb-admin-xl">
              <div>
                <h3 className="font-admin-headline-md text-admin-headline-md text-admin-on-surface dark:text-white">Statistik Pengunjung</h3>
                <p className="text-admin-on-surface-variant dark:text-neutral-400 font-admin-body-md">Daily traffic and interaction metrics</p>
              </div>
              <div className="flex bg-admin-surface-container-low dark:bg-[#1a1a1a] p-1 rounded-lg border border-admin-outline-variant dark:border-neutral-800">
                <button className="px-admin-md py-1.5 rounded-md text-admin-label-caps font-admin-label-caps bg-admin-surface dark:bg-[#111111] text-admin-primary shadow-sm">7 Days</button>
                <button className="px-admin-md py-1.5 rounded-md text-admin-label-caps font-admin-label-caps text-admin-on-surface-variant dark:text-neutral-400 hover:text-admin-primary transition-colors">30 Days</button>
              </div>
            </div>
            
            {/* CHART VISUALIZATION (CSS/SVG) */}
            <div className="h-[320px] w-full relative">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-admin-outline dark:text-neutral-400 font-admin-mono-label pr-4">
                <span>30.0k</span>
                <span>22.5k</span>
                <span>15.0k</span>
                <span>7.5k</span>
                <span>0</span>
              </div>
              
              {/* Chart Area */}
              <div className="ml-12 h-full border-l border-b border-admin-outline-variant dark:border-neutral-800 relative overflow-hidden">
                {/* Grid Lines */}
                <div className="absolute w-full h-full flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-dashed border-admin-outline-variant dark:border-neutral-800/30 w-full"></div>
                  <div className="border-t border-dashed border-admin-outline-variant dark:border-neutral-800/30 w-full"></div>
                  <div className="border-t border-dashed border-admin-outline-variant dark:border-neutral-800/30 w-full"></div>
                  <div className="border-t border-dashed border-admin-outline-variant dark:border-neutral-800/30 w-full"></div>
                  <div className="h-0"></div>
                </div>
                
                {/* SVG Chart Path */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  {/* Area */}
                  <path d="M0,280 Q50,220 100,240 T200,140 T300,180 T400,100 T500,160 T600,60 T700,90 L700,320 L0,320 Z" fill="url(#chartGradient)"></path>
                  {/* Line */}
                  <path d="M0,280 Q50,220 100,240 T200,140 T300,180 T400,100 T500,160 T600,60 T700,90" fill="none" stroke="#4F46E5" strokeLinecap="round" strokeWidth="3"></path>
                  {/* Tooltip Points */}
                  <circle cx="400" cy="100" fill="#ffffff" r="6" stroke="#4F46E5" strokeWidth="2"></circle>
                </svg>
                
                {/* X-Axis Labels */}
                <div className="absolute bottom-[-24px] w-full flex justify-between px-2 text-[10px] text-admin-outline dark:text-neutral-400 font-admin-mono-label">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* BENTO SECTION FOR OTHER CONTENT */}
        <div className="col-span-12 lg:col-span-4 space-y-admin-xl">
          <div className="bg-admin-surface dark:bg-[#111111] p-admin-lg rounded-xl border border-admin-outline-variant dark:border-neutral-800">
            <div className="flex items-center justify-between mb-admin-lg">
              <h4 className="font-admin-body-lg font-bold">Top Performance</h4>
              <TbDotsCircleHorizontal className="text-admin-outline dark:text-neutral-400" size={20} />
            </div>
            <div className="space-y-admin-md">
              <div className="flex items-center gap-admin-md">
                <div className="w-12 h-12 rounded-lg bg-admin-surface-container-high dark:bg-[#222] overflow-hidden border border-admin-outline-variant dark:border-neutral-800">
                  <Image 
                    src="/profile.webp" 
                    alt="Project Thumbnail" 
                    width={48} height={48} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <p className="font-admin-body-md font-semibold">Nexus Core Redesign</p>
                  <p className="text-xs text-admin-outline dark:text-neutral-400">Updated 2 days ago</p>
                </div>
                <TbTrendingUp className="text-admin-success-accent" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
