import PhotoSwiper from './PhotoSwiper';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Calendar, MapPin, Globe, ArrowRight } from 'lucide-react';

export default function Organizations({ organizations }) {
  if (!organizations || organizations.length === 0) return null;

  return (
    <section id="organisasi" className="py-24 px-6 bg-transparent relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-accent font-bold uppercase tracking-[0.3em] mb-3 text-sm">
            Pengalaman Organisasi
          </h2>
          <h3 className="text-4xl md:text-6xl font-black font-outfit text-foreground uppercase leading-none">
            Involvement <span className="text-accent">& Leadership</span>
          </h3>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 px-4 -mx-4 md:px-0 md:mx-0">
          {Array.isArray(organizations) &&
            organizations.map((org, idx) => (
              <div
                key={org.id}
                className="group p-1 bg-white/5 rounded-[2rem] border border-[var(--border-subtle)] hover:border-accent/30 transition-all duration-500 flex flex-col flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[30vw] xl:w-[22vw] snap-center h-[28rem]"
              >
                <div className="flex flex-col p-5 h-full bg-background rounded-[1.8rem] relative overflow-hidden">
                  
                  {/* Banner Image / Photo Swiper */}
                  <div className="w-full h-32 mb-4 rounded-xl overflow-hidden relative z-10 border border-[var(--border-subtle)] flex-shrink-0">
                     <PhotoSwiper
                        images={
                          Array.isArray(org.images) && org.images.length > 0 ? org.images : []
                        }
                        aspectRatio="aspect-[16/9]"
                        rounded="rounded-none"
                      />
                      {/* Logo Overlaid on Banner */}
                      {org.logoUrl && (
                        <div className="absolute -bottom-4 left-4 w-12 h-12 bg-background rounded-xl overflow-hidden p-1.5 border border-[var(--border-subtle)] shadow-lg z-20">
                          <Image
                            src={org.logoUrl}
                            alt={org.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1.5"
                          />
                        </div>
                      )}
                  </div>

                  <div className="flex-1 flex flex-col pt-2 min-h-0">
                    <Link href={`/organizations/${org.slug}`}>
                      <h4 className="text-lg font-black text-foreground group-hover:text-accent transition-colors uppercase tracking-tight leading-tight mb-1 truncate">
                        {org.name || 'Organization Name'}
                      </h4>
                    </Link>
                    <p className="text-accent font-bold uppercase text-[10px] tracking-widest mb-4 truncate">
                      {org.role || 'Role'}
                    </p>

                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                      {org.description || ''}
                    </p>

                    <div className="flex flex-wrap gap-2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-auto pt-4 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-accent" /> {org.period || 'N/A'}
                      </div>
                      {org.website && (
                        <a href={org.website} target="_blank" className="flex items-center gap-1 hover:text-accent">
                          <Globe size={10} /> Web
                        </a>
                      )}
                      {org.proofUrl && (
                        <a href={org.proofUrl} target="_blank" className="flex items-center gap-1 hover:text-foreground">
                          <Users size={10} /> Bukti
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Decorative Blob */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
}
