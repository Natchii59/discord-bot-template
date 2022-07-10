import { Client, Intents } from 'discord.js';
import { ActivityTypes } from 'discord.js/typings/enums';

import Database from './database/Database';
import Games from './games/Games';
import Handler from './handler/Handler';

export default class MyClient extends Client {
  public handler: Handler = new Handler(this);
  public database: Database = new Database();
  public games: Games = new Games();

  constructor() {
    super({
      intents: [Intents.FLAGS.GUILDS],
      presence: {
        activities: [
          {
            name: 'his computer',
            type: ActivityTypes.WATCHING,
          },
        ],
      },
    });
  }

  public async start(): Promise<void> {
    await this.database.start();
    await this.handler.start();

    await this.login(process.env.DISCORD_BOT_TOKEN);
  }
}
