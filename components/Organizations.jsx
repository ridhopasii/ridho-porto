import PhotoSwiper from './PhotoSwiper';
import { Users, Calendar, MapPin, Globe } from 'lucide-react';

export default function Organizations({ organizations }) {
  if (!organizations || organizations.length === 0) return null;

  return (
    <section id="organisasi" className="py-24 px-6 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-teal-500 font-bold uppercase tracking-[0.3em] mb-3 text-sm">
            Pengalaman Organisasi
          </h2>
          <h3 className="text-4xl md:text-6xl font-black font-outfit text-white uppercase leading-none">
            Involvement <span className="text-teal-500">& Leadership</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {Array.isArray(organizations) &&
            organizations.map((org, idx) => (
              <div
                key={org.id}
                className="group p-1 bg-white/5 rounded-[3rem] border border-white/10 hover:border-teal-500/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row gap-8 p-8 h-full bg-[#0d0d0d] rounded-[2.8rem]">
                  {/* Org Photos */}
                  <div className="w-full md:w-48 h-48 flex-shrink-0">
                    <PhotoSwiper
                      images={org.images}
                      aspectRatio="aspect-square"
                      rounded="rounded-[2rem]"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-black text-white group-hover:text-teal-500 transition-colors uppercase tracking-tight">
                          {org.name || 'Organization Name'}
                        </h4>
                        <p className="text-teal-500 font-bold uppercase text-xs tracking-widest mt-1">
                          {org.role || 'Role'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                        <Calendar size={12} className="text-teal-500" />{' '}
                        {org.period || 'Period N/A'}
                      </div>
                      {org.website && (
                        <a
                          href={org.website}
                          target="_blank"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/5 text-teal-500 rounded-full border border-teal-500/10 hover:bg-teal-500/10 transition-all"
                        >
                          <Globe size={12} /> Website
                        </a>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                      {org.description || ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Decorative Blob */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
}
