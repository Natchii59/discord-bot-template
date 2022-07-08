import { Collection } from 'discord.js';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

import MyClient from '../Client';
import BaseEvent from './structures/Event';

export default class Handler {
  public events: Collection<string, BaseEvent> = new Collection();

  constructor(private readonly client: MyClient) {}

  public async start(): Promise<void> {
    await this.startEvents();
  }

  private async startEvents(dir = '../../events'): Promise<void> {
    const path = join(__dirname, dir);

    const files = await readdir(path);

    for (const file of files) {
      const filePath = join(path, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) return this.startEvents(join(dir, file));

      if (extname(file) === '.ts') {
        const { default: Event } = await import(filePath);
        const instance = new Event(this.client) as BaseEvent;

        this.events.set(instance.getName(), instance);
        this.client.on(instance.getName(), instance.run.bind(instance));
      }
    }
  }
}
