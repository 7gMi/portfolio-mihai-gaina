# Portfolio — Mihai Gaina

Portfolio professionnel de Mihai Gaina, Developpeur SIG & Web / Geomaticien.

**Site live** : [portfolio-gainas-projects.vercel.app](https://portfolio-gainas-projects.vercel.app)

## Stack technique

- **Frontend** : React 19, TypeScript, Vite 7
- **Styling** : Tailwind CSS v4, Framer Motion
- **i18n** : i18next (FR / EN / RO)
- **Backend** : Supabase (PostgreSQL, Auth)
- **Animations** : Canvas API, d3-geo (globe interactif)
- **Deploiement** : Vercel (CI/CD)

## Fonctionnalites

- Globe 3D interactif avec particules et arcs animes (d3-geo + Canvas)
- Portfolio avec filtrage par categorie (Geomatique, Dev Web, Biomedical)
- Formulaire de contact (Supabase)
- Telechargement du CV adapte a la langue
- Internationalisation complete en 3 langues
- Code splitting et lazy loading des routes
- Accessibilite : skip link, focus trap, ARIA, navigation clavier

## Structure du projet

```
src/
  components/
    backgrounds/    # Animations Canvas (globe, particules, radar)
    layout/         # Navbar, Footer
    sections/       # Hero, Skills, Parcours, Contact
    ui/             # Badge, Button, SectionHeading
    utils/          # Breadcrumb, PageLoader
  data/             # projects.ts, parcours.ts, skills.ts
  lib/              # supabase.ts, i18n.ts
  locales/          # fr/, en/, ro/ (fichiers de traduction)
  pages/            # HomePage, AboutPage, PortfolioPage, etc.
public/
  images/           # Logos, projets, photos
  cv/               # PDF du CV (FR, EN, RO)
  reports/          # Rapports de projets (PDF)
```

## Installation

```bash
git clone https://github.com/7gMi/portfolio-mihai-gaina.git
cd portfolio-mihai-gaina
npm install
```

## Variables d'environnement

Creer un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Developpement

```bash
npm run dev      # Serveur de dev (Vite)
npm run build    # Build de production (tsc + vite build)
npm run preview  # Preview du build
npm run lint     # ESLint
```

## Deploiement

Le projet est deploye automatiquement sur Vercel a chaque push sur `main`.

## Licence

Projet personnel — tous droits reserves.
