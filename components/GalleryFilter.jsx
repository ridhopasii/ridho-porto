'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryFilter({ items }) {
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => {
    const cats = items.map((p) => p.category).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (filter === 'All') return items;
    return items.filter((p) => p.category === filter);
  }, [items, filter]);

  return (
    <section className="pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === cat
                  ? 'bg-rose-500 text-black shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredItems?.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="relative group rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 break-inside-avoid shadow-2xl"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-auto grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                  <h3 className="text-xl font-black font-outfit uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {item.description || 'Visual Documentation'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 p-8 bg-white/5 border border-white/10 rounded-[3rem]">
            <p className="text-gray-500 italic">Belum ada foto dalam kategori ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}
