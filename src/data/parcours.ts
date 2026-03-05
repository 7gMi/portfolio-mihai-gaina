export interface ParcourItem {
  type: 'work' | 'education';
  period: string;
  titleKey: string;
  placeKey: string;
  descriptionKey: string;
  location?: string;
}

export const parcours: ParcourItem[] = [
  {
    type: 'education',
    period: '2025 – 2027',
    titleKey: 'parcours.items.master.title',
    placeKey: 'parcours.items.master.place',
    descriptionKey: 'parcours.items.master.description',
    location: 'Paris, France',
  },
  {
    type: 'work',
    period: '2020 – 2026',
    titleKey: 'parcours.items.socotec.title',
    placeKey: 'parcours.items.socotec.place',
    descriptionKey: 'parcours.items.socotec.description',
    location: 'France',
  },
  {
    type: 'education',
    period: '2015 – 2019',
    titleKey: 'parcours.items.licence.title',
    placeKey: 'parcours.items.licence.place',
    descriptionKey: 'parcours.items.licence.description',
    location: 'Chișinău, Moldavie',
  },
  {
    type: 'education',
    period: '2011 – 2015',
    titleKey: 'parcours.items.colegiul.title',
    placeKey: 'parcours.items.colegiul.place',
    descriptionKey: 'parcours.items.colegiul.description',
    location: 'Chișinău, Moldavie',
  },
];
