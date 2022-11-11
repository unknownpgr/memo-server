// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Memo, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

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
      const memo = await prisma.memo.findUnique({
        where: { id: nid },
        include: { tags: true },
      });
      if (memo) res.status(200).json(memo);
      else res.status(404).end();
      break;
    }
    case "PUT": {
      // 이 부분은 상당히 구현이 어렵다. 태그가 이미 존재할 수도 있어서 단순히 update를 할 수 있는 게 아니기 때문이다.
      // 만약 ORM이 아니라 직접 SQL을 작성한다고 가정해보자. 그렇다면 먼저 없는 tags를 생성, tag 들의 id를 retriving,
      // 그걸 박아야 한다. 최적화는 나중에 하고 일단 구현하고 보자.

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

      console.log(tags);

      const memo = await prisma.memo.update({
        where: { id: nid },
        data: {
          content,
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
        include: {
          tags: true,
        },
      });

      if (memo) res.status(200).end();
      else res.status(500).end();
      break;
    }
  }
}
