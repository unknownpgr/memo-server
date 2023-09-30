import { PrismaClient, Memo as MemoSchema, Tag } from "@prisma/client";
import { Repository } from "../core/memoService";
import { Memo, User } from "../core/entity";

const prisma = new PrismaClient();

function convertToMemo(
  memoSchema: MemoSchema & {
    tags: Tag[];
  }
): Memo {
  return {
    number: memoSchema.number,
    content: memoSchema.content,
    tags: memoSchema.tags.map((tag) => tag.value),
    createdAt: memoSchema.createdAt.toISOString(),
    updatedAt: memoSchema.updatedAt.toISOString(),
  };
}

export class PrismaRepository implements Repository {
  async findMemo({
    userId,
    number,
  }: {
    userId: number;
    number: number;
  }): Promise<Memo> {
    const result = await prisma.memo.findFirst({
      where: { number, userId },
      select: {
        id: true,
        userId: true,
        number: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!result) throw new Error("Not found");

    const memo: Memo = convertToMemo(result);
    return memo;
  }

  async listMemo({
    userId,
    tags,
  }: {
    userId: number;
    tags?: string[];
  }): Promise<Memo[]> {
    const results = await prisma.memo.findMany({
      where: tags
        ? {
            userId,
            tags: {
              some: { value: { in: tags } },
            },
          }
        : { userId },
      select: {
        id: true,
        userId: true,
        number: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return results.map(convertToMemo);
  }

  async listTags({ userId }: { userId: number }): Promise<string[]> {
    const results = await prisma.tag.findMany({
      where: { userId },
      select: { value: true },
      orderBy: { value: "asc" },
    });

    return results.map((tag) => tag.value);
  }

  async createMemo({
    userId,
    content,
    tags,
  }: {
    userId: number;
    content: string;
    tags: string[];
  }): Promise<Memo> {
    const {
      _max: { number: maxNumber },
    } = await prisma.memo.aggregate({
      where: { userId },
      _max: { number: true },
    });
    const newNumber = maxNumber ? maxNumber + 1 : 1;

    // Upsert tags
    const tagIds = await Promise.all(
      tags.map(async (value: string) => {
        return (
          await prisma.tag.upsert({
            where: { userId_value: { userId, value } },
            create: { userId, value },
            update: { value },
          })
        ).id;
      })
    );

    const memo = await prisma.memo.create({
      data: {
        userId,
        content,
        tags: { connect: tagIds.map((id) => ({ id })) },
        number: newNumber,
      },
      include: {
        tags: true,
      },
    });

    return convertToMemo(memo);
  }

  async updateMemo({
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
    // Upsert tags
    const tagIds = await Promise.all(
      tags.map(async (value: string) => {
        return (
          await prisma.tag.upsert({
            where: { userId_value: { userId, value } },
            create: { userId, value },
            update: { value },
          })
        ).id;
      })
    );

    const memo = await prisma.memo.update({
      where: { userId_number: { userId, number } },
      data: {
        content,
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        tags: true,
      },
    });

    return convertToMemo(memo);
  }

  async deleteMemo({
    userId,
    number,
  }: {
    userId: number;
    number: number;
  }): Promise<void> {
    await prisma.memo.deleteMany({ where: { userId, number } });
  }

  async clearUnusedTags({ userId }: { userId: number }): Promise<void> {
    await prisma.tag.deleteMany({
      where: {
        userId,
        memos: { none: { NOT: [{ id: -1 }] } },
      },
    });
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
    return user;
  }
}
