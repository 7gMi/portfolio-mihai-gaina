export interface ParcourItem {
  type: 'work' | 'education';
  period: string;
  titleKey: string;
  placeKey: string;
  descriptionKey: string;
  location?: string;
  coords: [number, number]; // [longitude, latitude]
  address?: string;
}

export const parcours: ParcourItem[] = [
  {
    type: 'education',
    period: '2025 – 2027',
    titleKey: 'parcours.items.master.title',
    placeKey: 'parcours.items.master.place',
    descriptionKey: 'parcours.items.master.description',
    location: 'Paris, France',
    coords: [2.3636, 48.9362], // Université Paris 8, Saint-Denis
    address: 'Université Paris 8, Saint-Denis',
  },
  {
    type: 'work',
    period: '2020 – 2026',
    titleKey: 'parcours.items.socotec.title',
    placeKey: 'parcours.items.socotec.place',
    descriptionKey: 'parcours.items.socotec.description',
    location: 'France',
    coords: [2.2488, 48.7146], // 9 Rue Léon Blum, Palaiseau
    address: '9 Rue Léon Blum, Palaiseau',
  },
  {
    type: 'education',
    period: '2015 – 2019',
    titleKey: 'parcours.items.licence.title',
    placeKey: 'parcours.items.licence.place',
    descriptionKey: 'parcours.items.licence.description',
    location: 'Chișinău, Moldavie',
    coords: [28.8097, 47.0587], // UTM, Strada Studenților 9/8
    address: 'Strada Studenților 9/8, Chișinău',
  },
  {
    type: 'work',
    period: '2018 – 2019',
    titleKey: 'parcours.items.goImobil.title',
    placeKey: 'parcours.items.goImobil.place',
    descriptionKey: 'parcours.items.goImobil.description',
    location: 'Chișinău, Moldavie',
    coords: [28.8285, 47.0227], // Strada Kogălniceanu 9, Chișinău
    address: 'Strada Kogălniceanu 9, Chișinău',
  },
  {
    type: 'work',
    period: '2014 – 2017',
    titleKey: 'parcours.items.moldtelecom.title',
    placeKey: 'parcours.items.moldtelecom.place',
    descriptionKey: 'parcours.items.moldtelecom.description',
    location: 'Chișinău, Moldavie',
    coords: [28.8312, 47.0245], // Moldtelecom, Chișinău
    address: 'Chișinău, Moldavie',
  },
  {
    type: 'education',
    period: '2011 – 2015',
    titleKey: 'parcours.items.colegiul.title',
    placeKey: 'parcours.items.colegiul.place',
    descriptionKey: 'parcours.items.colegiul.description',
    location: 'Chișinău, Moldavie',
    coords: [28.8375, 47.0230], // Colegiul Politehnic, Strada Melestiu 12
    address: 'Strada Melestiu 12, Chișinău',
  },
];
