import { TbQuote } from "react-icons/tb";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { supabaseServer } from "@/common/libs/supabase-server";

const clampRating = (value: unknown): number => {
  const n = Math.round(Number(value));
  if (Number.isNaN(n)) return 5;
  return Math.min(5, Math.max(0, n));
};

const Testimonials = async () => {
  const { data } = await supabaseServer
    .from("Testimonial")
    .select("*")
    .order("id", { ascending: false });

  // Hormati flag showOnHome; perlakukan nilai kosong/undefined sebagai tampil
  // (aman bila kolom belum dimigrasikan). Tampilkan maksimal 6.
  const testimonials = (data || [])
    .filter((item) => item.showOnHome !== false)
    .slice(0, 6);

  // Jangan render section kosong.
  if (testimonials.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title="Testimoni" icon={<TbQuote size={22} />} />
        <SectionSubHeading>
          <p>Apa kata mereka yang pernah bekerja sama dengan saya.</p>
        </SectionSubHeading>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {testimonials.map((item) => {
          const rating = clampRating(item.rating);
          return (
            <figure
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <div className="flex items-center justify-between">
                <TbQuote className="h-5 w-5 text-neutral-300 dark:text-neutral-700" />
                <div className="text-sm text-yellow-500" aria-label={`Rating ${rating} dari 5`}>
                  {"★".repeat(rating)}
                  <span className="text-neutral-300 dark:text-neutral-700">
                    {"★".repeat(5 - rating)}
                  </span>
                </div>
              </div>

              <blockquote className="flex-1 text-sm italic leading-relaxed text-neutral-600 dark:text-neutral-400">
                &ldquo;{item.message}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                {item.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.avatarUrl}
                    alt={item.name || "Avatar"}
                    className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 text-lg font-bold text-neutral-500 dark:bg-neutral-700">
                    {item.name?.charAt(0) || "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-neutral-800 dark:text-neutral-100">
                    {item.name}
                  </h4>
                  <p className="truncate text-xs text-neutral-500">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
};

export default Testimonials;
