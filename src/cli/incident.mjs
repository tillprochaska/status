import { Incident } from '../incident.mjs';

const create = {
  command: 'create <id>',
  desc: 'Create an incident',
  builder: { title: {}, text: {} },
  handler: (argv) => {
    Incident.create(argv.id, {
      createdAt: new Date(),
      title: argv.title,
      text: argv.text,
    });
  },
};

const resolve = {
  command: 'resolve <id>',
  desc: 'Resolve an incident',
  builder: {},
  handler: (argv) => {
    Incident.find(argv.id).resolve().save();
  },
};

export default {
  command: 'incident',
  desc: 'Create and resolve incidents',
  builder: (yargs) => yargs.command([create, resolve]),
};
