import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function ChangelogPage({ params }: Props) {
  const { locale } = await params;
  
  // Clean redirect to dashboard since changelog is now integrated as a tab there
  redirect(`/${locale}/dashboard`);
}
