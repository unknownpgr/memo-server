import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  hashedPassword: z.string(),
  salt: z.string(),
});

export const memoSchema = z.object({
  id: z.number(),
  parentId: z.number(),
  userId: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const memoSummarySchema = z.object({
  id: z.number(),
  parentId: z.number(),
  userId: z.number(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// export type User = z.infer<typeof userSchema>;
// export type Memo = z.infer<typeof memoSchema>;
// export type MemoSummary = z.infer<typeof memoSummarySchema>;

export type User = {
  id: number;
  username: string;
  hashedPassword: string;
  salt: string;
};

export type Memo = {
  id: number;
  parentId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MemoSummary = {
  id: number;
  parentId: number;
  userId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};
