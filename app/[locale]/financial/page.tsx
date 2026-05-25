import { Metadata } from "next";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { getFinanceHubData } from "@/services/finance";

export const metadata: Metadata = {
  title: "Financial",
  description: "My personal financial tracker and wallet.",
};

const FinancialPage = async () => {
  const data = await getFinanceHubData();

  return (
    <Container data-aos="fade-up">
      <PageHeading
        title="Financial"
        description="My personal financial tracker and wallet information."
      />
      
      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Wallets</h2>
          {data.wallets?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.wallets.map((w: any) => (
                <div key={w.id} className="p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
                  <h3 className="font-semibold text-lg">{w.name}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Balance: {w.balance}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No wallets configured yet.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Transactions</h2>
          {data.transactions?.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="min-w-full text-sm">
                 <thead>
                   <tr className="border-b">
                     <th className="text-left py-2">Date</th>
                     <th className="text-left py-2">Type</th>
                     <th className="text-left py-2">Amount</th>
                     <th className="text-left py-2">Description</th>
                   </tr>
                 </thead>
                 <tbody>
                   {data.transactions.map((t: any) => (
                     <tr key={t.id} className="border-b last:border-0">
                       <td className="py-2">{new Date(t.date || t.created_at).toLocaleDateString()}</td>
                       <td className="py-2">{t.type}</td>
                       <td className="py-2">{t.amount}</td>
                       <td className="py-2 text-neutral-600">{t.description}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          ) : (
            <p className="text-neutral-500">No active transactions found.</p>
          )}
        </section>
      </div>
    </Container>
  );
};

export default FinancialPage;
