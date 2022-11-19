import { PrismaClient } from "@prisma/client";
import { IUser } from "../global";
import crypto from "crypto";

const prisma = new PrismaClient();

export function clearUnrelatedTags(userId: number) {
  return prisma.tag.deleteMany({
    where: {
      userId,
      memos: { none: { NOT: [{ id: -1 }] } },
    },
  });
}

export function findMemo(userId: number, id: number) {
  return prisma.memo.findFirst({
    where: { id, userId },
    select: {
      id: true,
      content: true,
      tags: { select: { id: true, value: true } },
    },
  });
}

export async function upsertMemo(
  userId: number,
  content: string,
  tags: string[],
  id?: number
) {
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

  // Disconnect all tags
  if (id) {
    await prisma.memo.update({
      where: { id },
      data: { tags: { set: [] } },
    });
  }

  const query = {
    userId,
    id,
    content,
    tags: { connect: tagIds.map((id) => ({ id })) },
  };

  let memo;
  if (id) {
    memo = await prisma.memo.upsert({
      where: { id },
      create: query,
      update: query,
      include: {
        tags: true,
      },
    });
  } else {
    memo = await prisma.memo.create({
      data: query,
      include: {
        tags: true,
      },
    });
  }

  return memo;
}

export function deleteMemo(userId: number, id: number) {
  return prisma.memo.deleteMany({ where: { userId, id } });
}

export function listMemo(userId: number, tags?: string[]) {
  return prisma.memo.findMany({
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
      content: true,
      tags: { select: { id: true, value: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function listTags(userId: number) {
  return prisma.tag.findMany({
    where: { userId },
    select: { id: true, value: true },
  });
}

const getRandomString = async (n: number) => {
  const buffer = Buffer.alloc(n);
  for (let i = 0; i < n; i++) {
    buffer[i] = Math.floor(Math.random() * 255);
  }
  return buffer.toString("base64");
};

const hash = async (password: string, salt: string) => {
  const key = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 256, "sha256", (err, key) => {
      if (err) return reject(err);
      resolve(key);
    });
  });
  return key.toString("base64");
};

export async function addUser(
  username: string,
  password: string
): Promise<IUser | null> {
  const salt = await getRandomString(32);
  const hashedPassword = await hash(password, salt);
  const user = await prisma.user.create({
    select: { id: true, username: true },
    data: { username, hashedPassword, salt },
  });
  return user;
}

export async function verifyUser(
  username: string,
  password: string
): Promise<IUser | null> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;

  const { id, hashedPassword, salt } = user;
  if ((await hash(password, salt)) !== hashedPassword) return null;

  return { id, username };
}
