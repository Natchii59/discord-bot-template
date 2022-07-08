import { ButtonInteraction } from 'discord.js';

export default abstract class BaseButton {
  constructor(private readonly customId: string) {}

  public getCustomId(): string {
    return this.customId;
  }

  abstract run(interaction: ButtonInteraction): any | Promise<any>;
}
