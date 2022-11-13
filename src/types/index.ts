export type MemoWithTags = {
  id: number;
  content: string;
  tags: {
    id: number;
    value: string;
  }[];
};
