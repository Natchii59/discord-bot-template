import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';

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
    const button = new MessageButton({
      customId: 'TestButton',
      style: 'PRIMARY',
      label: 'Hello',
    });

    return await interaction.reply({
      content: 'Chat Input Test Command Work',
      components: [new MessageActionRow({ components: [button] })],
    });
  }
}
