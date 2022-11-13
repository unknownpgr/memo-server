import { PrismaClient, Tag } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { listTags } from "../../../logic/logic";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tag[]>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const tags = await listTags();
      res.status(200).json(tags);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
