export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: 'geomatique' | 'dev-web' | 'biomedical';
  tags: string[];
  image?: string;
  github?: string;
  live?: string;
}

export const projects: Project[] = [
  {
    id: 'analyse-spatiale',
    titleKey: 'projects.items.analyseSpatiale.title',
    descriptionKey: 'projects.items.analyseSpatiale.description',
    category: 'geomatique',
    tags: ['QGIS', 'Python', 'PostGIS'],
    image: '/images/projets/geomatique/analyse-spatiale.jpg',
  },
  {
    id: 'teledetection',
    titleKey: 'projects.items.teledetection.title',
    descriptionKey: 'projects.items.teledetection.description',
    category: 'geomatique',
    tags: ['SNAP', 'Sentinel-2', 'NDVI'],
    image: '/images/projets/geomatique/teledetection.jpg',
  },
  {
    id: 'clad-primeco',
    titleKey: 'projects.items.cladPrimeco.title',
    descriptionKey: 'projects.items.cladPrimeco.description',
    category: 'dev-web',
    tags: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
    image: '/images/projets/dev-web/clad-primeco.jpg',
    github: 'https://github.com/7gMi/clad-primeco',
    live: 'https://clad-primeco.vercel.app',
  },
];
