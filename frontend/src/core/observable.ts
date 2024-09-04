export class Observable {
  private listeners: (() => void)[] = [];

  public addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  public removeListener(listener: () => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  protected notify() {
    this.listeners.forEach((l) => l());
  }
}
