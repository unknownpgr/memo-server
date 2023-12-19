import { Memo, MemoSummary, User } from "./entity";
import crypto from "crypto";

export interface Repository {
  findMemo({
    userId,
    memoId,
  }: {
    userId: number;
    memoId: number;
  }): Promise<Memo>;

  listMemo({ userId }: { userId: number }): Promise<MemoSummary[]>;
  createMemo({ userId }: { userId: number }): Promise<Memo>;
  updateMemo({ userId, memo }: { userId: number; memo: Memo }): Promise<Memo>;

  deleteMemo({
    userId,
    memoId,
  }: {
    userId: number;
    memoId: number;
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
    memoId,
  }: {
    userId: number;
    memoId: number;
  }): Promise<Memo> {
    return await this.repository.findMemo({ userId, memoId });
  }

  public async listMemo({ userId }: { userId: number }) {
    const memoList = await this.repository.listMemo({ userId });
    return memoList;
  }

  public async createMemo({ userId }: { userId: number }): Promise<Memo> {
    return await this.repository.createMemo({ userId });
  }

  public async updateMemo({
    userId,
    memo,
  }: {
    userId: number;
    memo: Memo;
  }): Promise<Memo> {
    const updatedMemo = await this.repository.updateMemo({
      userId,
      memo,
    });
    return updatedMemo;
  }

  public async deleteMemo({
    userId,
    memoId,
  }: {
    userId: number;
    memoId: number;
  }): Promise<void> {
    await this.repository.deleteMemo({ userId, memoId });
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
