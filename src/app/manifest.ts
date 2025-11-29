import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'myQS, Professional Quantity Surveying Services',
    short_name: 'myQS',
    description: 'Comprehensive quantity surveying solutions with precision, integrity, and innovation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a44a8ff',
    theme_color: '#1a2332',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}