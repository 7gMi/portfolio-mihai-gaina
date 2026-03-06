# Portfolio Mihai Gaina — Design System

## Palette de Couleurs

### Fonds (Backgrounds)
| Role               | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| Fond principal     | `#F8F9FA` | Body, fond de page (gris tres clair)        |
| Fond secondaire    | `#FFFFFF` | Cartes, modals, sections mises en avant     |
| Fond tertiaire     | `#EDF0F2` | Sections alternees, separateurs visuels     |
| Fond code/tech     | `#F1F3F5` | Blocs de code, zones techniques             |

### Couleurs Primaires (Identite Geo/Data/Tech)
| Role               | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| Primaire           | `#2563EB` | CTA, liens, elements interactifs principaux |
| Primaire hover     | `#1D4ED8` | Hover sur boutons et liens                  |
| Primaire light     | `#DBEAFE` | Badges, tags, fonds d'accent subtils        |
| Primaire dark      | `#1E3A5F` | Titres principaux, texte d'emphase          |

### Couleurs Secondaires (Accent Geomatique)
| Role               | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| Secondaire         | `#059669` | Accents, icones succes, elements geo/carte  |
| Secondaire hover   | `#047857` | Hover sur elements secondaires              |
| Secondaire light   | `#D1FAE5` | Fond badges secondaires                     |

### Textes
| Role               | Hex       | Contraste sur #F8F9FA |
|--------------------|-----------|------------------------|
| Texte principal    | `#1A1A2E` | 15.2:1 (AAA)          |
| Texte secondaire   | `#4A5568` | 7.1:1 (AAA)           |
| Texte desactive    | `#9CA3AF` | 3.5:1 (AA large)      |
| Texte sur primaire | `#FFFFFF` | 8.6:1 sur #2563EB     |

### Etats et Feedback
| Role               | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| Succes             | `#059669` | Validation, confirmation                    |
| Erreur             | `#DC2626` | Erreurs, champs invalides                   |
| Warning            | `#D97706` | Avertissements                              |
| Info               | `#2563EB` | Informations, aide                          |

### Bordures et Separateurs
| Role               | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| Bordure legere     | `#E5E7EB` | Cartes, inputs, separateurs                 |
| Bordure focus      | `#2563EB` | Focus ring accessibilite                    |
| Bordure hover      | `#93C5FD` | Hover sur cartes interactives               |

---

## Regles UI/UX Fondamentales

### 1. Hierarchie Visuelle
- **1 seule action primaire** par ecran (bouton bleu #2563EB)
- Titres en `#1E3A5F` (primaire dark) — poids visuel fort
- Corps de texte en `#1A1A2E` — lisibilite maximale
- Infos secondaires en `#4A5568` — hierarchie claire sans distraire
- Maximum 3 niveaux de taille typographique par section

### 2. Contraste et Accessibilite (WCAG 2.1 AA)
- Texte normal : ratio minimum 4.5:1
- Texte large (>18px ou >14px bold) : ratio minimum 3:1
- Elements interactifs : ratio minimum 3:1 avec le fond
- Focus visible sur TOUS les elements interactifs (ring #2563EB 2px)
- Ne jamais transmettre une info par la couleur seule (ajouter icone ou texte)

### 3. Espacement et Rythme
- Grille de base : 4px (tous les espacements sont multiples de 4)
- Padding interne cartes : 24px (6x base)
- Gap entre cartes : 24px
- Marges sections : 64px vertical (16x base) minimum
- Padding horizontal page : 16px mobile, 32px tablette, 64px desktop

### 4. Typographie
- Font principale : Inter ou system-ui (lisibilite ecran)
- Font code : JetBrains Mono ou monospace systeme
- Tailles recommandees :
  - H1 : 36px / 40px line-height (hero uniquement)
  - H2 : 28px / 36px line-height (titres de section)
  - H3 : 20px / 28px line-height (sous-titres)
  - Body : 16px / 24px line-height (texte courant)
  - Small : 14px / 20px line-height (legendes, metadata)
- Longueur de ligne max : 65-75 caracteres pour le confort de lecture

### 5. Composants Interactifs
- Boutons : border-radius 8px, padding 12px 24px, min-height 44px (touch target)
- Hover : transition 150ms ease — jamais instantane
- Cartes : border-radius 12px, shadow subtile (`0 1px 3px rgba(0,0,0,0.08)`)
- Hover cartes : shadow augmentee + leger translateY(-2px)
- Inputs : min-height 44px, border 1px #E5E7EB, focus ring 2px #2563EB

### 6. Responsive (Mobile-First)
- Breakpoints : 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Touch targets minimum 44x44px sur mobile
- Navigation : hamburger sous 768px
- Grille projets : 1 col mobile, 2 col tablette, 3 col desktop
- Images : lazy loading + format WebP avec fallback

### 7. Coherence
- 1 seule palette — ne jamais introduire de couleur hors systeme
- Meme border-radius partout (8px boutons, 12px cartes)
- Memes transitions partout (150ms ease)
- Meme shadow systeme (3 niveaux : sm, md, lg)

### 8. Performance Visuelle
- Pas plus de 2 fonts chargees
- Animations : uniquement transform et opacity (GPU-accelere)
- Preferer les transitions aux animations complexes
- Respecter prefers-reduced-motion pour l'accessibilite
- Pas de carousel auto-play — l'utilisateur controle la navigation

---

## Application par Section

| Section       | Fond      | Accent     | Notes                                 |
|---------------|-----------|------------|---------------------------------------|
| Header/Nav    | `#FFFFFF` | `#2563EB`  | Sticky, shadow au scroll              |
| Hero          | `#F8F9FA` | `#2563EB`  | 1 CTA primaire, titre #1E3A5F        |
| A propos      | `#FFFFFF` | `#1E3A5F`  | Photo + texte, fond blanc pour focus  |
| Competences   | `#EDF0F2` | `#2563EB`  | Grille icones, fond alterne           |
| Projets       | `#FFFFFF` | `#059669`  | Cartes avec hover, accent geo/vert    |
| Contact       | `#F8F9FA` | `#2563EB`  | Formulaire simple, 1 CTA             |
| Footer        | `#1E3A5F` | `#FFFFFF`  | Seule zone sombre — ancrage visuel    |
