export interface OrganizationProps {
  id?: number;
  name: string;
  role: string;
  period: string;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  proofUrl?: string | null;
  slug?: string | null;
  order?: number | null;
  showOnHome?: boolean | null;
  images?: string[] | null;
}
