import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Incident } from '../incident.mjs';
import { BUILD_DIR } from '../constants.mjs';

export default {
  command: 'build',
  desc: 'Build static articacts',
  builder: {},
  handler: (argv) => {
    const incidents = Incident.all()
      .filter((incident) => !incident.isResolved())
      .sort((a, b) => b - a);

    const outputPath = resolve(BUILD_DIR, 'incidents.json');
    const contents = JSON.stringify(incidents);

    mkdirSync(BUILD_DIR, { recursive: true });
    writeFileSync(outputPath, contents);
  },
};
