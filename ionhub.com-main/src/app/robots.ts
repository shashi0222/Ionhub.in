import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard/profile'],
      },
    ],
    sitemap: 'https://ionhub.in/sitemap.xml',
  };
}
