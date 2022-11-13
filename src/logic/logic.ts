import { Memo, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function clearUnrelatedTags() {
  return prisma.tag.deleteMany({
    where: { memos: { none: { NOT: [{ id: -1 }] } } },
  });
}

export function findMemo(id: number) {
  return prisma.memo.findUnique({
    where: { id },
    select: {
      id: true,
      content: true,
      tags: { select: { id: true, value: true } },
    },
  });
}

export async function upsertMemo(content: string, tags: string[], id?: number) {
  // Upsert tags
  const tagIds = await Promise.all(
    tags.map(async (tag: string) => {
      return (
        await prisma.tag.upsert({
          where: { value: tag },
          create: { value: tag },
          update: { value: tag },
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

export function deleteMemo(id: number) {
  return prisma.memo.delete({ where: { id } });
}

export function listMemo(tags?: string[]) {
  return prisma.memo.findMany({
    where: tags
      ? {
          tags: {
            some: { value: { in: tags } },
          },
        }
      : undefined,
    select: {
      id: true,
      content: true,
      tags: { select: { id: true, value: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function listTags() {
  return prisma.tag.findMany({ select: { id: true, value: true } });
}
