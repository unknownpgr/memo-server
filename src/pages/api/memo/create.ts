import type { NextApiRequest, NextApiResponse } from "next";
import { upsertMemo } from "../../../logic/logic";
import { IMemo } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IMemo>
) {
  const { content, tags } = req.body;
  const memo = await upsertMemo(content, tags);
  res.status(200).json(memo);
}
