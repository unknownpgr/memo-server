import { PrismaClient } from "@prisma/client";
import { IMemo, IUser } from "../global";
import crypto from "crypto";

const prisma = new PrismaClient();

async function tmp() {
  const users = await prisma.user.findMany({
    include: { memos: { orderBy: { createdAt: "asc" } } },
  });
  for (const user of users) {
    console.log(user.username);
    for (let i = 0; i < user.memos.length; i++) {
      // const updatedMemo = await prisma.memo.update({
      //   where: { id: user.memos[i].id },
      //   data: {
      //     number: i + 1,
      //   },
      // });
      // console.log(user.username, updatedMemo.number);
      const memo = user.memos[i];
      console.log(memo.id, memo.number, memo.content.substring(0, 10));
    }
  }
  console.log("FIN");
}

export function clearUnrelatedTags({ userId }: { userId: number }) {
  return prisma.tag.deleteMany({
    where: {
      userId,
      memos: { none: { NOT: [{ id: -1 }] } },
    },
  });
}

export function findMemo({
  userId,
  number,
}: {
  userId: number;
  number: number;
}): Promise<IMemo | null> {
  return prisma.memo.findFirst({
    where: { number, userId },
    select: {
      id: true,
      number: true,
      content: true,
      tags: { select: { id: true, value: true } },
    },
  });
}

export async function upsertMemo({
  userId,
  content,
  tags,
  number,
}: {
  userId: number;
  content: string;
  tags: string[];
  number?: number;
}): Promise<IMemo> {
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
  if (number) {
    await prisma.memo.update({
      where: { userId_number: { userId, number } },
      data: { tags: { set: [] } },
    });
  }

  // Calculate next number
  const aggregations = await prisma.memo.aggregate({
    where: {
      userId,
    },
    _max: {
      number: true,
    },
  });
  const nextNumber = (aggregations._max.number || 0) + 1;

  // Upsert new memo
  const query = {
    userId,
    content,
    number: nextNumber,
    tags: { connect: tagIds.map((id) => ({ id })) },
  };

  let memo;
  if (number) {
    memo = await prisma.memo.upsert({
      where: { userId_number: { userId, number } },
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

export function deleteMemo({
  userId,
  number,
}: {
  userId: number;
  number: number;
}) {
  return prisma.memo.deleteMany({ where: { userId, number } });
}

export function listMemo({
  userId,
  tags,
}: {
  userId: number;
  tags?: string[];
}) {
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
      number: true,
      tags: { select: { id: true, value: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function listTags({ userId }: { userId: number }) {
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

export async function addUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<IUser | null> {
  const salt = await getRandomString(32);
  const hashedPassword = await hash(password, salt);
  const user = await prisma.user.create({
    select: { id: true, username: true },
    data: { username, hashedPassword, salt },
  });
  return user;
}

export async function verifyUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<IUser | null> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;

  const { id, hashedPassword, salt } = user;
  if ((await hash(password, salt)) !== hashedPassword) return null;

  return { id, username };
}
