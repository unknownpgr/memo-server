import { Memo } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  clearUnrelatedTags,
  deleteMemo,
  findMemo,
  upsertMemo,
} from "../../../logic/logic";

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
      const memo = await findMemo(nid);
      if (memo) res.status(200).json(memo);
      else res.status(404).end();
      break;
    }

    case "PUT": {
      const { content, tags } = req.body;
      const memo = await upsertMemo(content, tags, nid);
      await clearUnrelatedTags();
      if (memo) res.status(200).end();
      else res.status(500).end();
      break;
    }

    case "DELETE": {
      const memo = await deleteMemo(nid);
      await clearUnrelatedTags();
      if (memo) res.status(200).end();
      else res.status(500).end();
      break;
    }
  }
}
