import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  
  // Clean redirect to the home page since contact is integrated there
  redirect(`/${locale}`);
}
