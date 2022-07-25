import { readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { parse, stringify } from 'yaml';

const DATA_DIR = resolve('./data');
const BUILD_DIR = resolve('./build');

class Incident {
  constructor(id, data = {}) {
    this.id = id;
    this.title = data.title;
    this.text = data.text;
    this.level = data.level;
    this.createdAt = new Date(data.createdAt);
    this.resolvedAt = data.resolvedAt ? new Date(data.resolvedAt) : null;

    const updates = data.updates || [];
    this.updates = updates.map((data) => new Update(data));
  }

  isResolved() {
    return this.resolvedAt !== null;
  }
}

class Update {
  constructor(data = {}) {
    this.text = data.text;
    this.createdAt = new Date(data.createdAt);
  }
}

function loadData() {
  return readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => {
      const dataPath = resolve(DATA_DIR, item.name, 'incident.yml');
      const data = parse(readFileSync(dataPath, 'utf-8'));
      return new Incident(item.name, data);
    });
}

export function build() {
  const incidents = loadData()
    .filter((incident) => !incident.isResolved())
    .sort((a, b) => b - a);

  const outputPath = resolve(BUILD_DIR, 'incidents.json')
  const contents = JSON.stringify(incidents);

  writeFileSync(outputPath, contents);
}

export function createIncident(id, data = {}) {
  id = id.toString();
  const incident = new Incident(id, data);
  const dataPath = resolve(DATA_DIR, id, 'incident.yml');
  const contents = stringify(incident);

  mkdirSync(dirname(dataPath), { recursive: true });
  writeFileSync(dataPath, contents);
}

export function resolveIncident(id, date) {
  id = id.toString();
  const dataPath = resolve(DATA_DIR, id, 'incident.yml');
  const data = parse(readFileSync(dataPath, 'utf-8'));
  const resolvedAt = new Date(date);
  const incident = new Incident(id, { ...data, resolvedAt });
  const contents = stringify(incident);

  writeFileSync(dataPath, contents);
}
