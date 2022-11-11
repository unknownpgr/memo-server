// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Memo, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<number>
) {
  const { content, tags } = req.body;

  const tagIds = await Promise.all(
    tags.map(async (tag: string) => {
      return (
        await prisma.tag.upsert({
          where: { value: tag },
          create: { value: tag },
          update: { value: tag },
        })
      ).id;
    })
  );

  const memo = await prisma.memo.create({
    data: { content, tags: { connect: tagIds.map((id) => ({ id })) } },
  });

  res.status(200).json(memo);
}
