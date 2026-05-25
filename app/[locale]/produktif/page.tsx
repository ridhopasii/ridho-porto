import { Metadata } from "next";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { getProductivityHubData } from "@/services/productivity";

export const metadata: Metadata = {
  title: "Produktifkuu",
  description: "My personal productivity hub.",
};

const ProduktifPage = async () => {
  const data = await getProductivityHubData();

  return (
    <Container data-aos="fade-up">
      <PageHeading
        title="Produktif"
        description="A dashboard measuring productivity, habits, and yearly goals."
      />
      
      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Yearly Goals</h2>
          {data.yearlyPlans?.length > 0 ? (
            <ul className="list-disc list-inside ml-4 space-y-2">
              {data.yearlyPlans.map((plan: any) => (
                <li key={plan.id}>
                  <span className="font-medium">{plan.title}</span> 
                  {plan.description && <span className="text-neutral-500 ml-2">- {plan.description}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500">No yearly plans available.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Habits Tracker</h2>
          {data.habitConfigs?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.habitConfigs.map((h: any) => (
                <div key={h.id} className="px-3 py-1 rounded-full border bg-neutral-50 dark:bg-neutral-900 shadow-sm text-sm">
                  {h.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No habits tracked.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Logs & Monthly Overviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Logs</h3>
                <p className="text-2xl font-bold">{data.logs?.length || 0} <span className="text-sm font-normal text-neutral-500">Entries</span></p>
             </div>
             <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Monthly Check-ins</h3>
                <p className="text-2xl font-bold">{data.monthlyTrackers?.length || 0} <span className="text-sm font-normal text-neutral-500">Months logged</span></p>
             </div>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default ProduktifPage;
