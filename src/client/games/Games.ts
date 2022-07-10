import { Collection } from 'discord.js';
import { BlackJackGame } from 'src/commands/game/Blackjack';

export default class Games {
  public blackjack: Collection<string, BlackJackGame> = new Collection();
}
