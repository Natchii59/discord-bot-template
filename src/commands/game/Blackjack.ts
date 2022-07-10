import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';

import MyClient from '../../client/Client';
import BaseCommand from '../../client/handler/structures/Command';
import { User } from '../../entities/user.entity';

export default class BlackjackCommand extends BaseCommand {
  constructor(private readonly client: MyClient) {
    super({
      type: 'CHAT_INPUT',
      name: 'blackjack',
      description: 'Jouer au BlackJack',
      options: [
        {
          type: 'NUMBER',
          name: 'points',
          description: 'Points à jouer',
          required: true,
          minValue: 1,
        },
      ],
    });
  }

  async run(interaction: CommandInteraction): Promise<any> {
    const user = await this.client.database.userRepository.findOne({
      where: { id: interaction.user.id },
    });

    if (!user)
      return await interaction.reply({
        content: "❌ Vous n'êtes pas encore inscrit, ou vous êtes introuvable.",
        ephemeral: true,
      });

    const bet = interaction.options.getNumber('points', true);

    if (user.points < bet)
      return await interaction.reply({
        content: "Vous n'avez pas assez de points pour miser cette somme.",
        ephemeral: true,
      });

    await new BlackJackGame(this.client).start(interaction, bet, user);
  }
}

export class BlackJackGame {
  private cards: string[] = [
    'A♥️',
    '2♥️',
    '3♥️',
    '4♥️',
    '5♥️',
    '6♥️',
    '7♥️',
    '8♥️',
    '9♥️',
    '10♥️',
    'V♥️',
    'D♥️',
    'R♥️',
    'A♣️',
    '2♣️',
    '3♣️',
    '4♣️',
    '5♣️',
    '6♣️',
    '7♣️',
    '8♣️',
    '9♣️',
    '10♣️',
    'V♣️',
    'D♣️',
    'R♣️',
    'A♠️',
    '2♠️',
    '3♠️',
    '4♠️',
    '5♠️',
    '6♠️',
    '7♠️',
    '8♠️',
    '9♠️',
    '10♠️',
    'V♠️',
    'D♠️',
    'R♠️',
    'A♦️',
    '2♦️',
    '3♦️',
    '4♦️',
    '5♦️',
    '6♦️',
    '7♦️',
    '8♦️',
    '9♦️',
    '10♦️',
    'V♦️',
    'D♦️',
    'R♦️',
  ];

  private playerHand: string[] = [];
  private dealerHand: string[] = [];

  private playerScore = 0;
  private dealerScore = 0;

  private bet: number;

  constructor(private readonly client: MyClient) {}

  public async start(
    interaction: CommandInteraction,
    bet: number,
    user: User,
  ): Promise<any> {
    this.bet = bet;
    this.client.games.blackjack.set(interaction.user.id, this);

    for (let i = 0; i < 2; i++) {
      this.playerHand.push(this.getCard());
    }

    for (let i = 0; i < 2; i++) {
      this.dealerHand.push(this.getCard());
    }

    this.getScores();

    if (this.playerScore === 21 || this.dealerScore === 21)
      return await this.startFinish(interaction);

    const embed = new MessageEmbed({
      color: 'DARK_RED',
      author: {
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      },
      title: 'BlackJack',
      fields: [
        {
          name: `Vous (${this.playerScore})`,
          value: this.playerHand.map((v) => v).join(' '),
          inline: true,
        },
        {
          name: `Croupier`,
          value: this.dealerHand[0],
          inline: true,
        },
        {
          name: 'Votre mise',
          value: `${this.bet} points`,
          inline: false,
        },
      ],
    });

    const TAKE_BUTTON = new MessageButton({
      customId: 'BLACKJACK_TAKE',
      style: 'PRIMARY',
      label: 'Prendre',
    });

    const HOLD_BUTTON = new MessageButton({
      customId: 'BLACKJACK_HOLD',
      style: 'SECONDARY',
      label: 'Rester',
    });

    const DOUBLE_BUTTON = new MessageButton({
      customId: 'BLACKJACK_DOUBLE',
      style: 'SUCCESS',
      label: 'Doubler',
      disabled: user.points < bet * 2,
    });

    return await interaction.reply({
      embeds: [embed],
      components: [
        new MessageActionRow({
          components: [TAKE_BUTTON, HOLD_BUTTON, DOUBLE_BUTTON],
        }),
      ],
      ephemeral: true,
    });
  }

  private async startFinish(interaction: CommandInteraction): Promise<any> {
    const user = await this.client.database.userRepository.findOne({
      where: { id: interaction.user.id },
    });

    let embed: MessageEmbed;

    if (this.playerScore === 21 && this.dealerScore !== 21) {
      await this.client.database.userRepository.save({
        ...user,
        points: user.points + this.bet,
      });

      embed = new MessageEmbed({
        color: 'DARK_RED',
        author: {
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        },
        title: 'BlackJack - Vous avez gagné',
        fields: [
          {
            name: `Vous (${this.playerScore})`,
            value: this.playerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: `Croupier (${this.dealerScore})`,
            value: this.dealerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: 'Vos gains',
            value: `${this.bet * 2} points`,
            inline: false,
          },
        ],
      });
    } else if (this.dealerScore === 21 && this.playerScore !== 21) {
      await this.client.database.userRepository.save({
        ...user,
        points: user.points - this.bet,
      });

      embed = new MessageEmbed({
        color: 'DARK_RED',
        author: {
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        },
        title: 'BlackJack - Vous avez perdu',
        fields: [
          {
            name: `Vous (${this.playerScore})`,
            value: this.playerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: `Croupier (${this.dealerScore})`,
            value: this.dealerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: 'Vos pertes',
            value: `${this.bet} points`,
            inline: false,
          },
        ],
      });
    } else if (this.dealerScore === this.playerScore) {
      embed = new MessageEmbed({
        color: 'DARK_RED',
        author: {
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        },
        title: 'BlackJack - Vous êtes égalité',
        fields: [
          {
            name: `Vous (${this.playerScore})`,
            value: this.playerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: `Croupier (${this.dealerScore})`,
            value: this.dealerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: 'Vos gains',
            value: `${this.bet} points`,
            inline: false,
          },
        ],
      });
    }

    this.client.games.blackjack.delete(interaction.user.id);

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  private getCard(): string {
    const card = this.cards[Math.floor(Math.random() * this.cards.length)];
    this.cards = this.cards.filter((v) => v !== card);
    return card;
  }

  private getScores(): void {
    this.playerScore = 0;
    this.dealerScore = 0;

    let playerCardAs = 0;
    let dealerCardAs = 0;

    this.playerHand.forEach((v) => {
      const card = v.slice(0, -2);
      if (card === 'A') playerCardAs++;
      this.playerScore += isNaN(parseInt(card))
        ? card === 'A'
          ? 11
          : 10
        : parseInt(card);
    });

    this.dealerHand.forEach((v) => {
      const card = v.slice(0, -2);
      if (card === 'A') dealerCardAs++;
      this.dealerScore += isNaN(parseInt(card))
        ? card === 'A'
          ? 11
          : 10
        : parseInt(card);
    });

    if (this.playerScore > 21) this.playerScore -= 10 * playerCardAs;
    if (this.dealerScore > 21) this.dealerScore -= 10 * dealerCardAs;
  }

  private async endGame(interaction: ButtonInteraction) {
    while (this.dealerScore < 17) {
      this.dealerHand.push(this.getCard());
      this.getScores();
    }

    const user = await this.client.database.userRepository.findOne({
      where: { id: interaction.user.id },
    });
    let embed: MessageEmbed;

    if (
      (this.playerScore > this.dealerScore && this.playerScore <= 21) ||
      (this.dealerScore > 21 && this.playerScore <= 21)
    ) {
      await this.client.database.userRepository.save({
        ...user,
        points: user.points + this.bet * 0.5,
      });

      embed = new MessageEmbed({
        color: 'DARK_RED',
        author: {
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        },
        title: 'BlackJack - Vous avez gagné',
        fields: [
          {
            name: `Vous (${this.playerScore})`,
            value: this.playerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: `Croupier (${this.dealerScore})`,
            value: this.dealerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: 'Vos gains',
            value: `${this.bet * 1.5} points`,
            inline: false,
          },
        ],
      });
    } else if (this.playerScore === this.dealerScore) {
      embed = new MessageEmbed({
        color: 'DARK_RED',
        author: {
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        },
        title: 'BlackJack - Vous êtes égalité',
        fields: [
          {
            name: `Vous (${this.playerScore})`,
            value: this.playerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: `Croupier (${this.dealerScore})`,
            value: this.dealerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: 'Vos gains',
            value: `${this.bet} points`,
            inline: false,
          },
        ],
      });
    } else {
      await this.client.database.userRepository.save({
        ...user,
        points: user.points - this.bet,
      });

      embed = new MessageEmbed({
        color: 'DARK_RED',
        author: {
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        },
        title: 'BlackJack - Vous avez perdu',
        fields: [
          {
            name: `Vous (${this.playerScore})`,
            value: this.playerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: `Croupier (${this.dealerScore})`,
            value: this.dealerHand.map((v) => v).join(' '),
            inline: true,
          },
          {
            name: 'Vos pertes',
            value: `${this.bet} points`,
            inline: false,
          },
        ],
      });
    }

    this.client.games.blackjack.delete(interaction.user.id);

    return await interaction.update({
      embeds: [embed],
      components: [],
    });
  }

  public async TAKE(interaction: ButtonInteraction): Promise<any> {
    this.playerHand.push(this.getCard());
    this.getScores();

    if (this.playerScore > 21) return this.endGame(interaction);

    const embed = new MessageEmbed({
      color: 'DARK_RED',
      author: {
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      },
      title: 'BlackJack',
      fields: [
        {
          name: `Vous (${this.playerScore})`,
          value: this.playerHand.map((v) => v).join(' '),
          inline: true,
        },
        {
          name: `Croupier`,
          value: this.dealerHand[0],
          inline: true,
        },
        {
          name: 'Votre mise',
          value: `${this.bet} points`,
          inline: false,
        },
      ],
    });

    const TAKE_BUTTON = new MessageButton({
      customId: 'BLACKJACK_TAKE',
      style: 'PRIMARY',
      label: 'Prendre',
    });

    const HOLD_BUTTON = new MessageButton({
      customId: 'BLACKJACK_HOLD',
      style: 'SECONDARY',
      label: 'Rester',
    });

    const DOUBLE_BUTTON = new MessageButton({
      customId: 'BLACKJACK_DOUBLE',
      style: 'SUCCESS',
      label: 'Doubler',
      disabled: true,
    });

    return await interaction.update({
      embeds: [embed],
      components: [
        new MessageActionRow({
          components: [TAKE_BUTTON, HOLD_BUTTON, DOUBLE_BUTTON],
        }),
      ],
    });
  }

  async HOLD(interaction: ButtonInteraction): Promise<any> {
    await this.endGame(interaction);
  }

  async DOUBLE(interaction: ButtonInteraction): Promise<any> {
    this.bet *= 2;

    await this.HOLD(interaction);
  }
}
