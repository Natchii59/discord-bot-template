import { UserContextMenuInteraction } from 'discord.js';

import MyClient from '../../client/Client';
import BaseCommand from '../../client/handler/structures/Command';

export default class SignUpUserContextMenu extends BaseCommand {
  constructor(private readonly client: MyClient) {
    super({
      type: 'USER',
      name: 'SignUp',
    });
  }

  async run(interaction: UserContextMenuInteraction): Promise<any> {
    await interaction.deferReply({
      ephemeral: true,
    });

    const { userRepository } = this.client.database;

    const user = await userRepository.findOne({
      where: { id: interaction.user.id },
    });

    if (user)
      return await interaction.editReply({
        content: '❌ Vous êtes déjà inscrit',
      });

    const newUser = userRepository.create(interaction.user);

    await userRepository.save(newUser);

    return await interaction.editReply({
      content: '✅ Vous venez de vous inscrire',
    });
  }
}
