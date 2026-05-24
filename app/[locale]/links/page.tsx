import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { supabaseServer } from "@/common/libs/supabase-server";
import { METADATA } from "@/common/constants/metadata";

export const metadata = {
  title: `Links ${METADATA.exTitle}`,
};

export const revalidate = 60;

export default async function LinksPage() {
  const { data: links } = await supabaseServer
    .from("Link")
    .select("*")
    .order("id", { ascending: true });

  return (
    <Container data-aos="fade-up">
      <PageHeading title="Tautan" description="Kumpulan tautan sosial media dan portofolio saya." />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {links?.length === 0 ? (
          <p className="text-neutral-500 italic">Belum ada tautan.</p>
        ) : (
          links?.map((link: any) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer"
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:scale-[1.02] transition-transform flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold">{link.title}</h4>
                <p className="text-sm text-neutral-500 mt-1 uppercase">{link.type}</p>
              </div>
              <div className="text-neutral-400">↗</div>
            </a>
          ))
        )}
      </div>
    </Container>
  );
}
