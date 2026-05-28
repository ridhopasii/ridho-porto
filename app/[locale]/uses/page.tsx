import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function UsesPage({ params }: Props) {
  const { locale } = await params;
  
  // Clean, permanent server-side redirect to dashboard
  redirect(`/${locale}/dashboard`);
}
