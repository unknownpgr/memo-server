import { Memo, Tag } from "@prisma/client";

export type MemoWithTags = Memo & {
  tags: Tag[];
};
