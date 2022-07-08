import { BaseCommandInteraction } from 'discord.js';
import MyClient from '../client/Client';
import BaseEvent from '../client/handler/structures/Event';

export default class InteractionCreateEvent extends BaseEvent {
  constructor(private readonly client: MyClient) {
    super('interactionCreate');
  }

  async run(interaction: BaseCommandInteraction): Promise<any> {
    if (
      interaction.isCommand() ||
      interaction.isMessageContextMenu() ||
      interaction.isUserContextMenu()
    ) {
      const command = this.client.handler.commands.get(interaction.commandName);

      command && (await command.run(interaction));
    } else if (interaction.isButton()) {
      const button = this.client.handler.buttons.get(interaction.customId);

      button && (await button.run(interaction));
    } else if (interaction.isSelectMenu()) {
      const selectMenu = this.client.handler.selectMenus.get(
        interaction.customId,
      );

      selectMenu && (await selectMenu.run(interaction));
    }
  }
}
