import { BaseCommandInteraction } from 'discord.js';
import MyClient from '../client/Client';
import BaseEvent from '../client/handler/structures/Event';

export default class InteractionCreateEvent extends BaseEvent {
  constructor(private readonly client: MyClient) {
    super('interactionCreate');
  }

  async run(interaction: BaseCommandInteraction): Promise<any> {
    if (interaction.isApplicationCommand()) {
      const command = this.client.handler.commands.get(interaction.commandName);

      await command.run(interaction);
    }
  }
}
