import { Memo, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Memo[]>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { tag } = req.query;
      const memos = await prisma.memo.findMany({
        where: tag
          ? {
              tags: {
                some: { value: `${tag}` },
              },
            }
          : undefined,
        include: { tags: true },
        orderBy: { updatedAt: "desc" },
      });
      res.status(200).json(memos);
      break;
    case "PUT":
      const { id, content, tags } = req.body;
      const memo = await prisma.memo.upsert({
        where: { id },
        update: { content, tags },
        create: { id, content, tags },
      });
      res.status(200).json([memo]);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
