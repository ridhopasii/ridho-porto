import Link from 'next/link';
import { Trophy, FileText, ArrowRight, ExternalLink, ImageIcon } from 'lucide-react';
import PhotoSwiper from './PhotoSwiper';

export default function Achievements({ awards, publications }) {
  return (
    <section className="py-24 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Awards */}
        <div>
          <h2 className="text-3xl font-black font-outfit mb-12 flex items-center gap-4 uppercase tracking-tight">
            <Trophy className="text-yellow-500" /> Awards{' '}
            <span className="text-gray-700">& Honors</span>
          </h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 px-4 -mx-4 md:px-0 md:mx-0">
            {Array.isArray(awards) &&
              awards.map((award) => (
                <div
                  key={award.id}
                  className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] group hover:border-yellow-500/30 transition-all flex-shrink-0 w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[100%] xl:w-[22vw] snap-center flex flex-col h-[28rem]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl">
                      <Trophy size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {award.date || 'Date N/A'}
                    </span>
                  </div>

                  <Link href={`/awards/${award.slug}`}>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                      {award.title || 'Award Title'}
                    </h3>
                  </Link>
                  <p className="text-yellow-500/80 font-bold uppercase text-[10px] tracking-widest mb-6">
                    {award.organizer || 'Organizer'}
                  </p>

                  {/* Documentation Photos */}
                  {Array.isArray(award.images) && award.images.length > 0 && (
                    <div className="mb-4 flex-1 min-h-0 relative">
                      <PhotoSwiper
                        images={award.images}
                        aspectRatio="h-full w-full absolute inset-0"
                        rounded="rounded-2xl"
                      />
                    </div>
                  )}

                  {/* Proof Links */}
                  <div className="flex flex-wrap gap-4 mt-auto pt-4">
                    <Link
                      href={`/awards/${award.slug}`}
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-yellow-500 transition-colors"
                    >
                      <ImageIcon size={12} /> View Full Record
                    </Link>
                    {award.proofUrl && (
                      <a
                        href={award.proofUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={12} /> Credentials
                      </a>
                    )}
                  </div>
                </div>
              ))}
            {(!Array.isArray(awards) || awards.length === 0) && (
              <p className="text-gray-600 italic">No awards found.</p>
            )}
          </div>
        </div>

        {/* Publications */}
        <div>
          <h2 className="text-3xl font-black font-outfit mb-12 flex items-center gap-4 uppercase tracking-tight">
            <FileText className="text-blue-500" /> Publications{' '}
            <span className="text-gray-700">& Research</span>
          </h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 px-4 -mx-4 md:px-0 md:mx-0">
            {Array.isArray(publications) &&
              publications.map((pub) => (
                <div
                  key={pub.id}
                  className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] group hover:border-blue-500/30 transition-all flex-shrink-0 w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[100%] xl:w-[22vw] snap-center flex flex-col h-[28rem]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                      <FileText size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {pub.date || 'Date N/A'}
                    </span>
                  </div>

                  <Link href={`/publications/${pub.slug}`}>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-500 transition-colors">
                      {pub.title || 'Publication Title'}
                    </h3>
                  </Link>
                  <p className="text-blue-500/80 font-bold uppercase text-[10px] tracking-widest mb-6">
                    {pub.outlet || 'Publisher'}
                  </p>

                  {/* Documentation Photos */}
                  {Array.isArray(pub.images) && pub.images.length > 0 && (
                    <div className="mb-4 flex-1 min-h-0 relative">
                      <PhotoSwiper
                        images={pub.images}
                        aspectRatio="h-full w-full absolute inset-0"
                        rounded="rounded-2xl"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 mt-auto pt-4">
                    <Link
                      href={`/publications/${pub.slug}`}
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-blue-500 transition-colors"
                    >
                      <ImageIcon size={12} /> Detail Abstract
                    </Link>
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-white transition-colors"
                      >
                        <ArrowRight size={12} /> Read Full Text
                      </a>
                    )}
                  </div>
                </div>
              ))}

            {(!Array.isArray(publications) || publications.length === 0) && (
              <p className="text-gray-600 italic">No publications found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
