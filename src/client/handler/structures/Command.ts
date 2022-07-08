import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';

export default abstract class BaseCommand {
  public options: ApplicationCommandData;

  constructor(options: ApplicationCommandData) {
    this.options = options;
  }

  abstract run(interaction: BaseCommandInteraction): any | Promise<any>;
}
