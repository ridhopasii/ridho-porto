export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/login/'],
      },
    ],
    sitemap: 'https://ridhorobbipasi.my.id/sitemap.xml',
  }
}
