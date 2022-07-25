import { readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { parse, stringify } from 'yaml';
import { DATA_DIR } from './constants.mjs';

export class Incident {
  constructor(id, data = {}) {
    this.id = id.toString();
    this.data = data;
  }

  static all() {
    return readdirSync(DATA_DIR, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((item) => Incident.find(item.name));
  }

  static create(id, data) {
    return new this(id, data).save();
  }

  static find(id) {
    return new this(id).load();
  }

  toObject() {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      resolvedAt: this.resolvedAt,
      level: this.level,
      text: this.text,
    };
  }

  get dataPath() {
    return resolve(DATA_DIR, this.id, 'incident.yml');
  }

  load() {
    this.data = parse(readFileSync(this.dataPath, 'utf-8'));

    return this;
  }

  save() {
    mkdirSync(dirname(this.dataPath), { recursive: true });
    const contents = stringify(this.toObject());
    writeFileSync(this.dataPath, contents);

    return this;
  }

  isResolved() {
    return this.resolvedAt !== null;
  }

  resolve(date = new Date()) {
    this.data.resolvedAt = new Date(date);

    return this;
  }

  get title() {
    return this.data.title || null;
  }

  get text() {
    return this.data.text || null;
  }

  get level() {
    return this.data.level || null;
  }

  get createdAt() {
    return new Date(this.data.createdAt);
  }

  get resolvedAt() {
    return this.data.resolvedAt ? new Date(this.data.resolvedAt) : null;
  }
}
