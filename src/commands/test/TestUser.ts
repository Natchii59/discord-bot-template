import { UserContextMenuInteraction } from 'discord.js';

import BaseCommand from '../../client/handler/structures/Command';

export default class TestChatInputCommand extends BaseCommand {
  constructor() {
    super({
      type: 'USER',
      name: 'TestUser',
    });
  }

  async run(interaction: UserContextMenuInteraction): Promise<any> {
    return await interaction.reply({
      content: 'User Context Menu Test Command Work',
    });
  }
}
