// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
      const memos = await prisma.memo.findMany({ include: { tags: true } });
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
