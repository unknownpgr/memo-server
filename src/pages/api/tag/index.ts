import { PrismaClient, Tag } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tag[]>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const tags = await prisma.tag.findMany();
      res.status(200).json(tags);
      break;
    case "PUT":
      res.status(200).json([]);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
