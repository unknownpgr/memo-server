import { Memo, User } from "./entity";
import crypto from "crypto";

export interface Repository {
  findMemo({
    userId,
    number,
  }: {
    userId: number;
    number: number;
  }): Promise<Memo>;

  listMemo({
    userId,
    tags,
  }: {
    userId: number;
    tags?: string[];
  }): Promise<Memo[]>;

  listTags({ userId }: { userId: number }): Promise<string[]>;

  createMemo({
    userId,
    content,
    tags,
  }: {
    userId: number;
    content: string;
    tags: string[];
  }): Promise<Memo>;

  updateMemo({
    userId,
    number,
    content,
    tags,
  }: {
    userId: number;
    number: number;
    content: string;
    tags: string[];
  }): Promise<Memo>;

  deleteMemo({
    userId,
    number,
  }: {
    userId: number;
    number: number;
  }): Promise<void>;

  addUser({
    username,
    passwordHash,
    salt,
  }: {
    username: string;
    passwordHash: string;
    salt: string;
  }): Promise<void>;

  getUser({ username }: { username: string }): Promise<User>;

  clearUnusedTags({ userId }: { userId: number }): Promise<void>;
}

function getRandomHexString(length: number) {
  return crypto.randomBytes(length).toString("hex");
}

function hash(password: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 256, "sha256", (err, key) => {
      if (err) return reject(err);
      resolve(key.toString("base64"));
    });
  });
}

export class MemoService {
  constructor(private readonly repository: Repository) {}
  public async findMemo({
    userId,
    number,
  }: {
    userId: number;
    number: number;
  }): Promise<Memo> {
    return await this.repository.findMemo({ userId, number });
  }

  public async listMemo({ userId, tags }: { userId: number; tags?: string[] }) {
    const tagList = await this.repository.listTags({ userId });
    const memoList = await this.repository.listMemo({ userId, tags });
    return {
      tags: tagList,
      memos: memoList,
    };
  }

  public async createMemo({
    userId,
    content,
    tags,
  }: {
    userId: number;
    content: string;
    tags: string[];
  }): Promise<Memo> {
    return await this.repository.createMemo({ userId, content, tags });
  }

  public async updateMemo({
    userId,
    number,
    content,
    tags,
  }: {
    userId: number;
    number: number;
    content: string;
    tags: string[];
  }): Promise<Memo> {
    const updatedMemo = await this.repository.updateMemo({
      userId,
      number,
      content,
      tags,
    });
    await this.repository.clearUnusedTags({ userId });

    return updatedMemo;
  }

  public async deleteMemo({
    userId,
    number,
  }: {
    userId: number;
    number: number;
  }): Promise<void> {
    await this.repository.deleteMemo({ userId, number });
    await this.repository.clearUnusedTags({ userId });
  }

  public async createUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> {
    const salt = getRandomHexString(32);
    const passwordHash = await hash(password, salt);
    await this.repository.addUser({ username, passwordHash, salt });
  }

  public async verifyUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<{
    id: number;
    username: string;
  }> {
    const user = await this.repository.getUser({ username });
    if (!user) throw new Error("User not found");
    const { id, hashedPassword, salt } = user;
    if ((await hash(password, salt)) !== hashedPassword)
      throw new Error("Password mismatch");
    return { id, username };
  }
}
