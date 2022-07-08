import MyClient from '../../client/Client';
import BaseEvent from '../../client/handler/structures/Event';

export default class ReadyEvent extends BaseEvent {
  constructor(private readonly client: MyClient) {
    super('ready');
  }

  run(): any {
    console.log(`${this.client.user.tag}`);
  }
}
