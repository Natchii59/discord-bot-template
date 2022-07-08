import { Client } from 'discord.js';

export default class MyClient extends Client {
  constructor() {
    super({
      intents: [],
    });
  }

  async start(): Promise<void> {
    await this.login(process.env.DISCORD_BOT_TOKEN);
  }
}
