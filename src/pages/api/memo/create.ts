// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Memo, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<number>
) {
  const memo = await prisma.memo.create({ data: { content: "" } });
  res.status(200).json(memo.id);
}
