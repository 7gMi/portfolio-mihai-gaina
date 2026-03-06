export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  longDescriptionKey?: string;
  category: 'geomatique' | 'dev-web' | 'biomedical';
  tags: string[];
  image?: string;
  github?: string;
  live?: string;
  report?: string;
  date?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'analyse-spatiale',
    titleKey: 'projects.items.analyseSpatiale.title',
    descriptionKey: 'projects.items.analyseSpatiale.description',
    longDescriptionKey: 'projects.items.analyseSpatiale.longDescription',
    category: 'geomatique',
    tags: ['ArcGIS Pro', 'IDRISI', 'AHP', 'WLC', 'IDW', 'OpenStreetMap'],
    image: '/images/projets/geomatique/analyse-spatiale.webp',
    report: '/reports/analyse-spatiale-multicritere.pdf',
    date: '2025',
    featured: true,
  },
  {
    id: 'dengue-girardot',
    titleKey: 'projects.items.dengueGirardot.title',
    descriptionKey: 'projects.items.dengueGirardot.description',
    longDescriptionKey: 'projects.items.dengueGirardot.longDescription',
    category: 'geomatique',
    tags: ['ArcGIS Pro', 'SaTScan', 'Getis-Ord Gi*', "Moran's I", 'SIVIGILA', 'Python'],
    image: '/images/projets/geomatique/dengue-girardot.webp',
    report: '/reports/analyse-dengue-girardot.pdf',
    date: '2026',
    featured: true,
  },
  {
    id: 'teledetection',
    titleKey: 'projects.items.teledetection.title',
    descriptionKey: 'projects.items.teledetection.description',
    longDescriptionKey: 'projects.items.teledetection.longDescription',
    category: 'geomatique',
    tags: ['SNAP', 'Sentinel-2', 'NDVI'],
    image: '/images/projets/geomatique/teledetection.jpg',
    date: '2025',
    featured: true,
  },
  {
    id: 'clad-primeco',
    titleKey: 'projects.items.cladPrimeco.title',
    descriptionKey: 'projects.items.cladPrimeco.description',
    longDescriptionKey: 'projects.items.cladPrimeco.longDescription',
    category: 'dev-web',
    tags: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
    image: '/images/projets/dev-web/clad-primeco.jpg',
    github: 'https://github.com/7gMi/clad-primeco',
    live: 'https://clad-primeco.vercel.app',
  },
];
