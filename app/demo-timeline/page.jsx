'use client';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { ChevronDown, Calendar, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const dummyData = [
  { id: 1, period: '2025 - Present', title: 'Senior Developer', company: 'Tech Corp', desc: 'Memimpin tim pengembangan frontend.' },
  { id: 2, period: '2023 - 2025', title: 'UI/UX Designer', company: 'Creative Studio', desc: 'Merancang antarmuka aplikasi mobile dan web.' },
  { id: 3, period: '2021 - 2023', title: 'Junior Programmer', company: 'Startup Inc', desc: 'Mengembangkan fitur-fitur dasar.' },
];

export default function DemoTimeline() {
  const [activeAcc, setActiveAcc] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-32">
        <div className="text-center">
          <h1 className="text-4xl font-black font-outfit uppercase mb-4 text-teal-500">Preview 3 Opsi Timeline</h1>
          <p className="text-gray-400">Silakan bandingkan ketiga opsi di bawah ini (scroll ke bawah).</p>
        </div>

        {/* OPSI 1: STICKY SCROLL */}
        <section className="border border-white/10 p-8 md:p-16 rounded-[3rem] bg-white/[0.02]">
          <h2 className="text-3xl font-black font-outfit uppercase mb-12 border-b border-white/10 pb-4">Opsi 1: Apple-Style Sticky Scroll</h2>
          <div className="relative">
            {dummyData.map((item, idx) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-8 md:gap-20 mb-24 last:mb-0">
                {/* Sticky Left Side */}
                <div className="md:w-1/3">
                  <div className="sticky top-32 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/30">
                      <Calendar className="text-teal-500" size={20} />
                    </div>
                    <span className="text-xl md:text-3xl font-black tracking-tighter text-teal-500">{item.period}</span>
                  </div>
                </div>
                {/* Content Right Side */}
                <div className="md:w-2/3 pt-2">
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">{item.title}</h3>
                  <p className="text-teal-500 font-bold uppercase tracking-widest text-sm mb-6">{item.company}</p>
                  <p className="text-gray-400 text-lg leading-relaxed">{item.desc} Suspendisse potenti. Nullam ac turpis ac justo consectetur luctus.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OPSI 2: ACCORDION GLASSMORPHISM */}
        <section className="border border-white/10 p-8 md:p-16 rounded-[3rem] bg-white/[0.02]">
          <h2 className="text-3xl font-black font-outfit uppercase mb-12 border-b border-white/10 pb-4">Opsi 2: Glassmorphism Interactive Accordion</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {dummyData.map((item) => (
              <div key={item.id} className="border border-white/10 rounded-3xl overflow-hidden bg-white/5 transition-all">
                <button 
                  onClick={() => setActiveAcc(activeAcc === item.id ? null : item.id)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">{item.period}</span>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <ChevronDown className={`transition-transform ${activeAcc === item.id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAcc === item.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8"
                    >
                      <div className="pt-6 border-t border-white/10">
                        <p className="text-teal-500 font-bold uppercase tracking-widest text-xs mb-4">{item.company}</p>
                        <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* OPSI 3: BENTO BOX GRID */}
        <section className="border border-white/10 p-8 md:p-16 rounded-[3rem] bg-white/[0.02]">
          <h2 className="text-3xl font-black font-outfit uppercase mb-12 border-b border-white/10 pb-4">Opsi 3: Bento Box Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 (Paling Baru - Besar) */}
            <div className="md:col-span-2 md:row-span-2 p-8 rounded-[2rem] bg-teal-500/10 border border-teal-500/20 flex flex-col justify-end min-h-[300px]">
              <div className="mt-auto">
                <span className="inline-block px-4 py-2 rounded-full bg-teal-500 text-black font-bold text-xs uppercase tracking-widest mb-4">Latest: {dummyData[0].period}</span>
                <h3 className="text-3xl font-black mb-2">{dummyData[0].title}</h3>
                <p className="text-teal-400 mb-4 font-bold uppercase text-xs tracking-widest">{dummyData[0].company}</p>
                <p className="text-gray-300">{dummyData[0].desc}</p>
              </div>
            </div>

            {/* Box 2 (Kecil) */}
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col min-h-[200px]">
              <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2">{dummyData[1].period}</span>
              <h3 className="text-xl font-bold mb-1">{dummyData[1].title}</h3>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">{dummyData[1].company}</p>
              <p className="text-gray-500 text-sm mt-auto">{dummyData[1].desc}</p>
            </div>

            {/* Box 3 (Kecil) */}
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col min-h-[200px]">
              <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2">{dummyData[2].period}</span>
              <h3 className="text-xl font-bold mb-1">{dummyData[2].title}</h3>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">{dummyData[2].company}</p>
              <p className="text-gray-500 text-sm mt-auto">{dummyData[2].desc}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
