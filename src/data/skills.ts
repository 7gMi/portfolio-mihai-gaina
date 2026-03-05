export interface SkillCategory {
  key: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    key: 'sig',
    skills: ['QGIS', 'ArcGIS', 'PostGIS', 'GeoServer', 'OpenLayers', 'Leaflet'],
  },
  {
    key: 'dev',
    skills: ['React', 'TypeScript', 'Python', 'HTML/CSS', 'Tailwind', 'Node.js'],
  },
  {
    key: 'teledetection',
    skills: ['SNAP', 'Google Earth Engine', 'Sentinel Hub', 'NDVI/NDWI'],
  },
  {
    key: 'instrumentation',
    skills: ['Capteurs vibratoires', 'Inclinomètres', 'Tachéomètres', 'Nivellement'],
  },
  {
    key: 'outils',
    skills: ['Git', 'Docker', 'PostgreSQL', 'Vite', 'Figma', 'Linux'],
  },
];
