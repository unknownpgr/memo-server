import { z } from "zod";

export const memoSchema = z.object({
  id: z.number(),
  parentId: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const memoSummarySchema = z.object({
  id: z.number(),
  parentId: z.number(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Memo = {
  id: number;
  parentId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MemoSummary = {
  id: number;
  parentId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};
