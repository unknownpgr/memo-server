// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Memo, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function clearUnrelatedTags() {
  return await prisma.tag.deleteMany({
    where: { memos: { none: { NOT: [{ id: -1 }] } } },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Memo>
) {
  let { id } = req.query;

  // Validation
  const nid = Number.parseInt(`${id}`);
  if (isNaN(nid) || typeof nid !== "number") {
    res.status(422).end();
    return;
  }

  switch (req.method) {
    case "GET": {
      // Find memo
      const memo = await prisma.memo.findUnique({
        where: { id: nid },
        include: { tags: true },
      });
      if (memo) res.status(200).json(memo);
      else res.status(404).end();
      break;
    }
    case "PUT": {
      const { content, tags } = req.body;

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
      await prisma.memo.update({
        where: { id: nid },
        data: { tags: { set: [] } },
      });

      // Update content and tags
      const memo = await prisma.memo.update({
        where: { id: nid },
        data: {
          content,
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
        include: {
          tags: true,
        },
      });

      await clearUnrelatedTags();

      if (memo) res.status(200).end();
      else res.status(500).end();
      break;
    }

    case "DELETE": {
      const memo = await prisma.memo.delete({ where: { id: nid } });

      await clearUnrelatedTags();

      if (memo) res.status(200).end();
      else res.status(500).end();
      break;
    }
  }
}
