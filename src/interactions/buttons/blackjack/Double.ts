import { ButtonInteraction } from 'discord.js';

import MyClient from '../../../client/Client';
import BaseButton from '../../../client/handler/structures/Button';

export default class BlackjackDoubleButton extends BaseButton {
  constructor(private readonly client: MyClient) {
    super('BLACKJACK_DOUBLE');
  }

  async run(interaction: ButtonInteraction): Promise<any> {
    const bj = this.client.games.blackjack.get(interaction.user.id);

    if (!bj)
      return await interaction.reply({
        content: 'Votre partie est introuvable, ou une erreur est survenue',
        ephemeral: true,
      });

    await bj.DOUBLE(interaction);
  }
}
