export default async function sitemap() {
  const baseUrl = 'https://ridhorobbipasi.my.id';

  // In a real app, you would fetch slugs from your database (Supabase)
  // to generate dynamic paths for blogs, projects, etc.
  
  const routes = [
    '',
    '/projects',
    '/blog',
    '/gallery',
    '/education',
    '/awards',
    '/publications',
    '/organizations',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
