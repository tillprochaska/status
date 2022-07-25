import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { build, createIncident, resolveIncident } from './index.mjs';

yargs(hideBin(process.argv))
  .command(
    'incident',
    'Create and resolve incidents',
    (yargs) => {
      yargs
        .command(
          'create <id>',
          'Create an incident',
          { title: {}, text: {} },
          (argv) => createIncident(argv.id, {
            createdAt: new Date(),
            title: argv.title,
            text: argv.text,
          })
        )
        .command(
          'resolve <id>',
          'Resolve an incident',
          {},
          (argv) => resolveIncident(argv.id, new Date())
        );
    },
  )
  .command(
    'build',
    'Build static page',
    {},
    (argv) => build()
  )
  .argv;
