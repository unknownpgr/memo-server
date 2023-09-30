import fs from "fs/promises";
import { MemoService } from "./memoService";

export class AuthService {
  private authStorage: Map<string, number> = new Map();
  constructor(private service: MemoService) {
    this.load();
  }

  private async load() {
    try {
      const data = await fs.readFile("/tmp/auth.json", "utf-8");
      this.authStorage = new Map([...JSON.parse(data), ...this.authStorage]);
    } catch {
      // ignore
    }
  }

  private async save() {
    await fs.writeFile("/tmp/auth.json", JSON.stringify([...this.authStorage]));
  }

  public async authenticate(username: string, password: string) {
    const user = await this.service.verifyUser({ username, password });
    const token = Math.random().toString(36).slice(2);
    this.authStorage.set(token, user.id);
    this.save();
    return token;
  }

  public async deauthenticate(token: string) {
    this.authStorage.delete(token);
    this.save();
  }

  public authorize(token: string) {
    const userId = this.authStorage.get(token);
    if (userId === undefined) {
      throw new Error("Unauthorized");
    }
    return userId;
  }
}
