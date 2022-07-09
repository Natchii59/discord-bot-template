import { CommandInteraction, MessageEmbed } from 'discord.js';

import MyClient from '../../client/Client';
import BaseCommand from '../../client/handler/structures/Command';

export default class ProfileCommand extends BaseCommand {
  constructor(private readonly client: MyClient) {
    super({
      type: 'CHAT_INPUT',
      name: 'profile',
      description: "Résumé du profil d'un utilisateur",
      options: [
        {
          type: 'USER',
          name: 'user',
          description: "L'utilisateur",
          required: false,
        },
      ],
    });
  }

  async run(interaction: CommandInteraction): Promise<any> {
    const userTarget =
      interaction.options.getUser('USER', false) || interaction.user;

    const user = await this.client.database.userRepository.findOne({
      where: { id: userTarget.id },
    });

    if (!user)
      return await interaction.reply({
        content:
          "❌ Cet utilisateur n'est pas encore inscrit, ou il est introuvable.",
        ephemeral: true,
      });

    const embed = new MessageEmbed({
      color: 'DARK_GOLD',
      footer: {
        text: userTarget.tag,
      },
      thumbnail: {
        url: userTarget.displayAvatarURL({
          format: 'png',
          size: 512,
          dynamic: true,
        }),
      },
      title: `Profil de ${user.username}`,
      fields: [
        {
          name: 'Points',
          value: `${user.points}`,
        },
      ],
    });

    return await interaction.reply({
      embeds: [embed],
    });
  }
}
