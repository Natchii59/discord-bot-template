import { SelectMenuInteraction } from 'discord.js';

export default abstract class BaseSelectMenu {
  constructor(private readonly customId: string) {}

  public getCustomId(): string {
    return this.customId;
  }

  abstract run(interaction: SelectMenuInteraction): any | Promise<any>;
}
