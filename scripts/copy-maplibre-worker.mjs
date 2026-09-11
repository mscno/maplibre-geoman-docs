import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = dirname(fileURLToPath(import.meta.resolve('maplibre-gl')));
const destination = 'static/vendor/maplibre';
mkdirSync(destination, { recursive: true });
// The module worker imports the shared module by a relative URL.
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
  copyFileSync(join(dist, file), join(destination, file));
}
