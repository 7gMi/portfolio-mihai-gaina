/**
 * Generate accurate globe SVG logo with real continent shapes
 * Uses Natural Earth 110m data + d3-geo orthographic projection
 * Centered on France (2°E, 46°N) with geolocation pin
 */
import { geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load world topology data (Natural Earth 110m — accurate shapes)
const worldPath = resolve(__dirname, '../node_modules/world-atlas/countries-110m.json');
const world = JSON.parse(readFileSync(worldPath, 'utf-8'));
const countries = feature(world, world.objects.countries);

// SVG dimensions — taller to fit MG below the globe
const width = 400;
const height = 480;
const cx = width / 2;
const cy = 195;          // globe centered higher to leave room below
const globeRadius = 185;

// Orthographic projection centered on France (2°E, 46°N)
const projection = geoOrthographic()
  .translate([cx, cy])
  .scale(globeRadius)
  .center([0, 0])
  .rotate([-2, -46, 0])   // lon=2°E, lat=46°N
  .clipAngle(90);

const pathGen = geoPath(projection);

// Generate continent paths
const continentPaths = [];
countries.features.forEach(f => {
  const d = pathGen(f);
  if (d) continentPaths.push(d);
});

// France geolocation pin position (Paris: 2.35°E, 48.86°N)
const parisCoord = projection([2.35, 48.86]);

// Chisinau, Moldova pin (28.83°E, 47.01°N) — origin
const chisinauCoord = projection([28.83, 47.01]);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none">
  <!-- Logo MG — Globe avec continents reels (Natural Earth 110m) -->
  <!-- Projection orthographique centree sur la France -->
  <!-- MG sous le globe -->

  <!-- Fond globe -->
  <circle cx="${cx}" cy="${cy}" r="${globeRadius + 5}" fill="#0F172A"/>
  <circle cx="${cx}" cy="${cy}" r="${globeRadius}" fill="#0B1628"/>

  <!-- Contour globe -->
  <circle cx="${cx}" cy="${cy}" r="${globeRadius}" fill="none" stroke="#1E3A5F" stroke-width="1.5" opacity="0.5"/>

  <!-- Grille meridiens/paralleles -->
  ${generateGraticule()}

  <!-- Continents (donnees reelles Natural Earth) -->
  <g fill="#2563EB" opacity="0.28" stroke="#38BDF8" stroke-width="0.4" stroke-opacity="0.35">
    ${continentPaths.map(d => `<path d="${d}"/>`).join('\n    ')}
  </g>

  <!-- Pin geolocalisation — Paris, France -->
  ${parisCoord ? `
  <g transform="translate(${parisCoord[0]}, ${parisCoord[1] - 12})">
    <!-- Halo -->
    <circle cy="12" r="8" fill="#38BDF8" opacity="0.15"/>
    <circle cy="12" r="4" fill="#38BDF8" opacity="0.25"/>
    <!-- Pin -->
    <path d="M0,-10 C-6,-10 -10,-6 -10,0 C-10,7 0,16 0,16 C0,16 10,7 10,0 C10,-6 6,-10 0,-10 Z" fill="#38BDF8"/>
    <circle cy="-1" r="3.5" fill="#0B1628"/>
    <!-- Label -->
    <text x="14" y="2" font-family="'Inter', Arial, sans-serif" font-weight="600" font-size="11" fill="#38BDF8" opacity="0.8">FR</text>
  </g>` : '<!-- Paris not visible -->'}

  ${chisinauCoord ? `
  <!-- Point d'origine — Chisinau, Moldova -->
  <circle cx="${chisinauCoord[0]}" cy="${chisinauCoord[1]}" r="2.5" fill="#2DD4BF" opacity="0.6"/>
  <circle cx="${chisinauCoord[0]}" cy="${chisinauCoord[1]}" r="5" fill="none" stroke="#2DD4BF" stroke-width="0.8" opacity="0.3"/>
  ` : ''}

  <!-- Reflet subtil -->
  <ellipse cx="${cx - 50}" cy="${cy - 60}" rx="90" ry="60" fill="white" opacity="0.02" transform="rotate(-20 ${cx - 50} ${cy - 60})"/>

  <!-- Anneau orbital -->
  <ellipse cx="${cx}" cy="${cy}" rx="${globeRadius + 8}" ry="45" stroke="#38BDF8" stroke-width="0.6" opacity="0.12" fill="none" transform="rotate(-20 ${cx} ${cy})"/>

  <!-- ========== MG sous le globe ========== -->
  <text x="${cx - 5}" y="${cy + globeRadius + 65}" font-family="'Space Grotesk', 'Arial Black', Arial, sans-serif" font-weight="800" font-size="72" fill="#0F172A" text-anchor="end" letter-spacing="-2">M</text>
  <text x="${cx + 5}" y="${cy + globeRadius + 65}" font-family="'Space Grotesk', 'Arial Black', Arial, sans-serif" font-weight="800" font-size="72" fill="#38BDF8" text-anchor="start" letter-spacing="-2">G</text>
</svg>`;

function generateGraticule() {
  const lines = [];

  // Paralleles (latitudes): every 30°
  for (let lat = -60; lat <= 90; lat += 30) {
    const coords = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      const p = projection([lon, lat]);
      if (p) coords.push(p);
    }
    if (coords.length > 5) {
      const d = 'M' + coords.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L');
      lines.push(`<path d="${d}" stroke="#1E3A5F" stroke-width="0.3" opacity="0.2" fill="none"/>`);
    }
  }

  // Meridiens (longitudes): every 30°
  for (let lon = -180; lon < 180; lon += 30) {
    const coords = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const p = projection([lon, lat]);
      if (p) coords.push(p);
    }
    if (coords.length > 5) {
      const d = 'M' + coords.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L');
      lines.push(`<path d="${d}" stroke="#1E3A5F" stroke-width="0.3" opacity="0.2" fill="none"/>`);
    }
  }

  return lines.join('\n  ');
}

const outPath = resolve(__dirname, 'logo-v5-globe-continents.svg');
writeFileSync(outPath, svg);
console.log(`Logo generated: ${outPath}`);
console.log(`Paris pin at: ${parisCoord ? `(${parisCoord[0].toFixed(1)}, ${parisCoord[1].toFixed(1)})` : 'not visible'}`);
console.log(`Chisinau pin at: ${chisinauCoord ? `(${chisinauCoord[0].toFixed(1)}, ${chisinauCoord[1].toFixed(1)})` : 'not visible'}`);
