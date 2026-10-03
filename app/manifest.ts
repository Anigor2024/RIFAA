import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RIFAA — Contemporary Saudi Fashion',
    short_name: 'RIFAA',
    description: 'Premium bilingual Saudi fashion ecommerce experience.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F4EF',
    theme_color: '#511D24',
    orientation: 'portrait-primary',
  };
}
