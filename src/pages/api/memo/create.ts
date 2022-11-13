import { Memo } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { upsertMemo } from "../../../logic/logic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Memo>
) {
  const { content, tags } = req.body;
  const memo = await upsertMemo(content, tags);
  res.status(200).json(memo);
}
