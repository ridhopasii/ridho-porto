import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { supabaseServer } from "@/common/libs/supabase-server";

export const metadata = {
  title: "Changelog - Satria Bahari",
};

export const revalidate = 60;

export default async function ChangelogPage() {
  const { data: changelogs } = await supabaseServer
    .from("Changelog")
    .select("*")
    .order("date", { ascending: false });

  return (
    <Container data-aos="fade-up">
      <PageHeading title="Catatan Perubahan" description="Riwayat pembaruan proyek dan website." />
      <div className="mt-8 relative border-l border-neutral-200 dark:border-neutral-800 ml-3 md:ml-0 space-y-10">
        {changelogs?.length === 0 ? (
          <p className="text-neutral-500 italic ml-6">Belum ada catatan perubahan.</p>
        ) : (
          changelogs?.map((log: any) => (
            <div key={log.id} className="relative pl-6 md:pl-8">
              <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[6.5px] top-1.5 border-4 border-white dark:border-neutral-950"></div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="font-bold text-lg">{log.version}</span>
                <span className="text-sm text-neutral-500">{new Date(log.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="text-neutral-700 dark:text-neutral-300 prose dark:prose-invert max-w-none text-sm">
                <p className="whitespace-pre-wrap">{log.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
