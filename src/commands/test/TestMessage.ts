import { MessageContextMenuInteraction } from 'discord.js';

import BaseCommand from '../../client/handler/structures/Command';

export default class TestChatInputCommand extends BaseCommand {
  constructor() {
    super({
      type: 'MESSAGE',
      name: 'TestMessage',
    });
  }

  async run(interaction: MessageContextMenuInteraction): Promise<any> {
    return await interaction.reply({
      content: 'Message Context Menu Test Command Work',
    });
  }
}
