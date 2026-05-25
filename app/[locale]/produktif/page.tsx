import { redirect } from "next/navigation";

export default async function ProduktifPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  redirect(`/${locale}/dashboard/private`);
}
