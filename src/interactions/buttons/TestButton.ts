import { ButtonInteraction } from 'discord.js';
import BaseButton from '../../client/handler/structures/Button';

export default class TestButton extends BaseButton {
  constructor() {
    super('TestButton');
  }

  async run(interaction: ButtonInteraction): Promise<any> {
    return await interaction.reply({
      content: `Hello ${interaction.user.tag}`,
    });
  }
}
