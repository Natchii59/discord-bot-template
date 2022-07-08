import { Client, Intents } from 'discord.js';
import { ActivityTypes } from 'discord.js/typings/enums';
import { join } from 'path';
import { createConnection, getRepository, Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import Handler from './handler/Handler';

export default class MyClient extends Client {
  public handler: Handler = new Handler(this);

  public userRepository: Repository<User>;

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
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, '..', '**', '*.entity.{js,ts}')],
      synchronize: true,
    });

    this.userRepository = getRepository(User);

    await this.handler.start();

    await this.login(process.env.DISCORD_BOT_TOKEN);
  }
}
