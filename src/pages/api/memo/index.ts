import { Memo, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { listMemo, upsertMemo } from "../../../logic/logic";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Memo[]>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { tag } = req.query;
      const memos = await listMemo(tag ? [`${tag}`] : undefined);
      res.status(200).json(memos);
      break;
    case "PUT":
      const { content, tags } = req.body;
      const memo = await upsertMemo(content, tags);
      res.status(200).json([memo]);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
