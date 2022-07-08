import MyClient from '../client/Client';
import BaseEvent from '../client/handler/structures/Event';

export default class ReadyEvent extends BaseEvent {
  constructor(private readonly client: MyClient) {
    super('ready');
  }

  async run(): Promise<any> {
    await this.client.application.commands.set(
      this.client.handler.commands.map((command) => command.options),
    );

    console.log(`${this.client.user.tag}`);
  }
}
