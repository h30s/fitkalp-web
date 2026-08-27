import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FitKalp Member Portal', short_name: 'FitKalp', description: 'Membership, dues, classes, and agreements for FitKalp gym members',
    start_url: '/portal', display: 'standalone', background_color: '#F4F7F5', theme_color: '#2B9361',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/Icon.png', sizes: '865x767', type: 'image/png', purpose: 'any' },
    ],
  };
}
