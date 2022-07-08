export default abstract class BaseEvent {
  constructor(private name: string) {}

  public getName(): string {
    return this.name;
  }

  abstract run(...args: any[]): any | Promise<any>;
}
