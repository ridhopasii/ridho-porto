import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@supabase/supabase-js";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { METADATA } from "@/common/constants/metadata";
import { checkPrivateDashboardAuth } from "@/common/libs/privateDashboardAuth";
import Dashboard from "@/modules/dashboard/components/Dashboard";
import PrivateDashboardGate from "@/modules/dashboard/components/PrivateDashboardGate";

type Props = { params: Promise<{ locale: string; slug?: string[] }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Private Hub ${METADATA.exTitle}`,
    description: "Personal private dashboard for productivity and finances.",
    alternates: { canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/private-hub` },
  };
}

export default async function PrivateHubPage({ params }: Props) {
  const { locale } = await params;
  const isAuth = await checkPrivateDashboardAuth();

  if (!isAuth) {
    return (
      <Container data-aos="fade-up">
        <PageHeading 
          title="Private Hub" 
          description="Dashboard eksklusif yang membutuhkan akses otorisasi khusus." 
        />
        <PrivateDashboardGate />
      </Container>
    );
  }

  // Fetch data directly using Supabase service role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
  );

  const [
    { data: logs },
    { data: monthlyTrackers },
    { data: habitConfigs },
    { data: savingsPlans },
    { data: yearlyPlans },
    { data: wallets },
    { data: transactions }
  ] = await Promise.all([
    supabase.from("Productivity").select("*").order("date", { ascending: false }).limit(30),
    supabase.from("MonthlyTracker").select("*").order("date", { ascending: false }).limit(30),
    supabase.from("HabitConfig").select("*").order("sortOrder"),
    supabase.from("TabunganUmroh").select("*").order("createdAt", { ascending: false }),
    supabase.from("YearlyPlan").select("*").order("sortOrder"),
    supabase.from("Wallets").select("*"),
    supabase.from("FinancialTransactions").select("*").order("date", { ascending: false }).limit(50),
  ]);

  return (
    <Dashboard
      locale={locale}
      productivity={{
        logs: logs || [],
        monthlyTrackers: monthlyTrackers || [],
        habitConfigs: habitConfigs || [],
        savingsPlans: savingsPlans || [],
        yearlyPlans: yearlyPlans || [],
      }}
      finance={{
        wallets: wallets || [],
        transactions: transactions || [],
      }}
    />
  );
}
