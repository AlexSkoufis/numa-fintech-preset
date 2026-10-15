// Generates lib/map-dots.json: a dot-matrix world map (equirectangular) sampled from
// Natural Earth 110m land (world-atlas). Run once: `npm run map`.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
const topo = require('world-atlas/land-110m.json');
const land = feature(topo, topo.objects.land);

const STEP = 2.2; // degrees between dots
const dots = [];
for (let lat = 78; lat >= -56; lat -= STEP) {
  for (let lon = -168; lon <= 190; lon += STEP) {
    const l = lon > 180 ? lon - 360 : lon;
    if (geoContains(land, [l, lat])) dots.push([Math.round(l * 10) / 10, Math.round(lat * 10) / 10]);
  }
}
await fs.writeFile(path.join(root, 'lib', 'map-dots.json'), JSON.stringify(dots));
console.log('dots', dots.length);
