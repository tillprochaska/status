import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import buildCommand from './cli/build.mjs';
import incidentCommand from './cli/incident.mjs';

export function run() {
  return yargs(hideBin(process.argv)).command([buildCommand, incidentCommand])
    .argv;
}
