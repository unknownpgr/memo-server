import fs from "fs/promises";
import { MemoService } from "./memoService";
import crypto from "crypto";

const authorizedUsers = [
  "IbWFCwz0zMYAbNc1/uMWl5sClYiGfXOhE1cqqDjLR1Z2RE+QI/9lx0wc9fNvUKqrq1i3+pdRDEMAoMpFBuZY",
];
const salt = "FM0Bvn9gy9eWNumyWkcYvh54h95xe9SHdZqKjilB7uTlj5XX6JtA";

function hash(password: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 63, "sha256", (err, key) => {
      if (err) return reject(err);
      resolve(key.toString("base64"));
    });
  });
}

export class AuthService {
  private authStorage: Set<string> = new Set();

  constructor(private service: MemoService) {
    this.load();
  }

  private async load() {
    try {
      const data = await fs.readFile("/tmp/auth.json", "utf-8");
      const auth = JSON.parse(data);
      this.authStorage = new Set(auth);
    } catch {
      // ignore
    }
  }

  private async save() {
    await fs.writeFile("/tmp/auth.json", JSON.stringify([...this.authStorage]));
  }

  public async authenticate(password: string) {
    const hashed = await hash(password, salt);
    if (!authorizedUsers.includes(hashed)) {
      throw new Error("Unauthorized");
    }
    const token = Math.random().toString(36).slice(2);
    this.authStorage.add(token);
    this.save();
    return token;
  }

  public async deauthenticate(token: string) {
    this.authStorage.delete(token);
    this.save();
  }

  public authorize(token: string) {
    if (!this.authStorage.has(token)) {
      throw new Error("Unauthorized");
    }
  }
}
