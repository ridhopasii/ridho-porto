import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { supabaseServer } from "@/common/libs/supabase-server";
import { METADATA } from "@/common/constants/metadata";

export const metadata = {
  title: `Uses ${METADATA.exTitle}`,
};

export const revalidate = 60; // ISR cache every 60s

export default async function UsesPage() {
  const { data: uses } = await supabaseServer
    .from("Uses")
    .select("*")
    .order("id", { ascending: true });

  const categories = uses ? Array.from(new Set(uses.map((u: any) => u.category))) : [];

  return (
    <Container data-aos="fade-up">
      <PageHeading title="Peralatan" description="Alat dan perangkat lunak yang saya gunakan." />
      <div className="mt-8 space-y-10">
        {categories.length === 0 ? (
          <p className="text-neutral-500 italic">Belum ada data peralatan.</p>
        ) : (
          categories.map(category => (
            <div key={category as string}>
              <h3 className="text-xl font-bold mb-4">{category as string}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uses?.filter((u: any) => u.category === category).map((item: any) => (
                  <a 
                    key={item.id} 
                    href={item.url || "#"} 
                    target={item.url ? "_blank" : "_self"} 
                    className={`block p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm ${item.url ? "hover:scale-[1.02] transition-transform" : ""}`}
                  >
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
