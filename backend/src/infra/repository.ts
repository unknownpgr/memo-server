import { PrismaClient } from "@prisma/client";
import { Repository } from "../core/memoService";
import {
  Memo,
  MemoSummary,
  User,
  memoSchema,
  memoSummarySchema,
  userSchema,
} from "../core/entity";

const prisma = new PrismaClient();

export class PrismaRepository implements Repository {
  async findMemo({
    userId,
    memoId,
  }: {
    userId: number;
    memoId: number;
  }): Promise<Memo> {
    const result = await prisma.memo.findFirst({
      where: { id: memoId, userId },
    });
    if (!result) throw new Error("Not found");
    return memoSchema.parse(result);
  }

  async listMemo({ userId }: { userId: number }): Promise<MemoSummary[]> {
    const results = await prisma.memo.findMany({
      where: { userId },
      select: {
        id: true,
        parentId: true,
        userId: true,
        title: true,
        content: true, // Will be removed in the future
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return results.map((memo) => {
      if (!memo.title) memo.title = memo.content?.slice(0, 20) || "No title";
      return memoSummarySchema.parse(memo);
    });
  }

  async createMemo({ userId }: { userId: number }): Promise<Memo> {
    const memo = await prisma.memo.create({
      data: {
        userId,
      },
    });
    return memoSchema.parse(memo);
  }

  async updateMemo({
    userId,
    memo,
  }: {
    userId: number;
    memo: Memo;
  }): Promise<Memo> {
    memoSchema.parse(memo);
    const { id, title, content, parentId } = memo;
    const updatedMemo = await prisma.memo.update({
      where: { userId, id },
      data: { title, content, parentId },
    });
    return memoSchema.parse(updatedMemo);
  }

  async deleteMemo({
    userId,
    memoId,
  }: {
    userId: number;
    memoId: number;
  }): Promise<void> {
    await prisma.memo.delete({ where: { userId, id: memoId } });
  }

  async addUser({
    username,
    passwordHash,
    salt,
  }: {
    username: string;
    passwordHash: string;
    salt: string;
  }): Promise<void> {
    await prisma.user.create({
      data: { username, hashedPassword: passwordHash, salt },
    });
  }

  async getUser({ username }: { username: string }): Promise<User> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error("Not found");
    return userSchema.parse(user);
  }
}
