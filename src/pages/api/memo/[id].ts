// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Memo, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Memo>
) {
  let { id } = req.query;
  if (!id) {
    res.status(404).end();
    return;
  }
  let _id;
  if (Array.isArray(id)) _id = +id[0];
  else _id = +id;
  const memo = await prisma.memo.findUnique({ where: { id: _id } });
  if (memo) res.status(200).json(memo);
  else res.status(404).end;
}
