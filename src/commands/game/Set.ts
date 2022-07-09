import { CommandInteraction } from 'discord.js';

import MyClient from '../../client/Client';
import BaseCommand from '../../client/handler/structures/Command';

export default class SetCommand extends BaseCommand {
  constructor(private readonly client: MyClient) {
    super({
      type: 'CHAT_INPUT',
      name: 'set',
      description: 'Permet de gérer notre profil',
      options: [
        {
          type: 'SUB_COMMAND',
          name: 'username',
          description: 'Permet de changer notre surnom',
          options: [
            {
              type: 'STRING',
              name: 'username',
              description: 'Surnom à changer',
              required: true,
            },
          ],
        },
      ],
    });
  }

  async run(interaction: CommandInteraction): Promise<any> {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case 'username':
        return this.setUsername(interaction);
    }
  }

  async setUsername(interaction: CommandInteraction): Promise<any> {
    await interaction.deferReply({
      ephemeral: true,
    });

    const username = interaction.options.getString('username', true);

    if (username.length < 3 || username.length > 20)
      return await interaction.editReply({
        content: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères",
      });

    const user = await this.client.database.userRepository.findOne({
      where: { id: interaction.user.id },
    });

    if (!user)
      return await interaction.editReply({
        content: "❌ Veuillez d'abord vous s'inscrire",
      });

    await this.client.database.userRepository.save({
      ...user,
      username,
    });

    return await interaction.editReply({
      content: 'Votre surnom a été modifié avec succès',
    });
  }
}
