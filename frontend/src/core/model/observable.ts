export class Observable<Event = void> {
  private listeners: ((event: Event) => void)[] = [];

  public addListener(listener: (event: Event) => void) {
    this.listeners.push(listener);
  }

  public removeListener(listener: (event: Event) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  public removeAllListeners() {
    this.listeners = [];
  }

  protected notify(event: Event) {
    this.listeners.forEach((l) => l(event));
  }
}
