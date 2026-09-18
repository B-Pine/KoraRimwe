import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KoraRimwe — Rwanda Driving Theory',
    short_name: 'KoraRimwe',
    description:
      'Study Rwanda road rules, explore road signs and sit timed mock exams for the driving theory test.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#1F6B4F',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
