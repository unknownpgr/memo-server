import crypto from "crypto";
import fs from "fs/promises";
import { z } from "zod";

const authSchema = z.object({
  passwordHash: z.string(),
  salt: z.string(),
  sessions: z.array(
    z.object({
      token: z.string(),
      expiresAt: z.number(),
    })
  ),
});
type Auth = z.infer<typeof authSchema>;

export class AuthService {
  private auth: Auth | null = null;

  private static async hash(password: string, salt: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      crypto.pbkdf2(password, salt, 10000, 63, "sha256", (err, key) => {
        if (err) return reject(err);
        resolve(key.toString("base64"));
      });
    });
  }

  private static randomString(n: number) {
    return crypto.randomBytes(n).toString("base64");
  }

  constructor(private readonly authFilePath = "/db/auth.json") {
    this.load();
    setInterval(() => this.cronJob(), 60_000).unref();
  }

  private async cronJob() {
    if (!this.auth) return;

    // Remove expired sessions
    const now = Date.now();
    this.auth.sessions = this.auth.sessions.filter((s) => s.expiresAt > now);
    await this.save();
  }

  private async load() {
    await fs.mkdir("/db", { recursive: true });

    try {
      const data = await fs.readFile(this.authFilePath, "utf-8");
      const auth = JSON.parse(data);
      this.auth = authSchema.parse(auth);
    } catch {
      this.auth = {
        passwordHash: "",
        salt: AuthService.randomString(32),
        sessions: [],
      };
    }
  }

  private async save() {
    await fs.writeFile(
      this.authFilePath,
      JSON.stringify(this.auth, null, 2),
      "utf-8"
    );
  }

  /**
   * Issue a token that expires in the given duration
   * @param duration Duration in milliseconds
   * @returns
   */
  private issueToken(duration: number = 24 * 60 * 60 * 1000) {
    if (!this.auth) {
      throw new Error("Service is not initialized");
    }

    const token = AuthService.randomString(32);
    const expiresAt = Date.now() + duration;
    this.auth.sessions.push({ token, expiresAt });
    this.save(); // Note that it is not awaited, because it is not critical
    return token;
  }

  private validateToken(token: string) {
    if (!this.auth) {
      throw new Error("Service is not initialized");
    }

    const session = this.auth.sessions.find((s) => s.token === token);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }
  }

  private extendToken(token: string, duration: number = 24 * 60 * 60 * 1000) {
    if (!this.auth) {
      throw new Error("Service is not initialized");
    }

    const session = this.auth.sessions.find((s) => s.token === token);
    if (session) {
      session.expiresAt = Date.now() + duration;
      this.save();
    }
  }

  public async login(password: string): Promise<string> {
    if (!this.auth) {
      throw new Error("Service is not initialized");
    }

    const hashed = await AuthService.hash(password, this.auth.salt);

    // In case of initial setup, register the password
    if (!this.auth.passwordHash) {
      this.auth.passwordHash = hashed;
      await this.save();
      return this.issueToken(); // 24 hours
    }

    // Else, validate the password
    if (hashed !== this.auth.passwordHash) {
      throw new Error("Unauthorized");
    }

    return this.issueToken();
  }

  public async logout(token: string) {
    if (!this.auth) {
      throw new Error("Service is not initialized");
    }

    this.validateToken(token);
    this.auth.sessions = this.auth.sessions.filter((s) => s.token !== token);
    await this.save();
  }

  public authorize(token: string) {
    this.validateToken(token);
    this.extendToken(token);
  }
}
