import { CommandInteraction } from 'discord.js';

import BaseCommand from '../../client/handler/structures/Command';

export default class TestChatInputCommand extends BaseCommand {
  constructor() {
    super({
      type: 'CHAT_INPUT',
      name: 'test',
      description: 'Chat Input Test',
    });
  }

  async run(interaction: CommandInteraction): Promise<any> {
    return await interaction.reply({
      content: 'Chat Input Test Command Work',
    });
  }
}
