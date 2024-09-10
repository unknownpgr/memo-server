import { z } from "zod";

export const memoSchema = z.object({
  id: z.number(),
  parentId: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const memoSummarySchema = z.object({
  id: z.number(),
  parentId: z.number(),
  title: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Memo = {
  id: number;
  parentId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type MemoSummary = {
  id: number;
  parentId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
};
