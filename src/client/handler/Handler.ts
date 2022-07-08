import { Collection } from 'discord.js';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

import MyClient from '../Client';
import BaseButton from './structures/Button';
import BaseCommand from './structures/Command';
import BaseEvent from './structures/Event';
import BaseSelectMenu from './structures/SelectMenu';

export default class Handler {
  public events: Collection<string, BaseEvent> = new Collection();
  public commands: Collection<string, BaseCommand> = new Collection();
  public buttons: Collection<string, BaseButton> = new Collection();
  public selectMenus: Collection<string, BaseSelectMenu> = new Collection();

  constructor(private readonly client: MyClient) {}

  public async start(): Promise<void> {
    await this.startCommands();
    await this.startInteractions();
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

  private async startCommands(dir = '../../commands'): Promise<void> {
    const path = join(__dirname, dir);

    const files = await readdir(path);

    for (const file of files) {
      const filePath = join(path, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) return this.startCommands(join(dir, file));

      if (extname(file) === '.ts') {
        const { default: Command } = await import(filePath);
        const instance = new Command(this.client) as BaseCommand;

        this.commands.set(instance.options.name, instance);
      }
    }
  }

  private async startInteractions(dir = '../../interactions'): Promise<void> {
    const path = join(__dirname, dir);

    const files = await readdir(path);

    for (const file of files) {
      const filePath = join(path, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory())
        return this.startInteractions(join(dir, file));

      if (extname(file) === '.ts') {
        const { default: Interaction } = await import(filePath);
        const instance = new Interaction(this.client);

        if (instance instanceof BaseButton)
          this.buttons.set(instance.getCustomId(), instance);
        if (instance instanceof BaseSelectMenu)
          this.selectMenus.set(instance.getCustomId(), instance);
      }
    }
  }
}
