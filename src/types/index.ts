export type ITag = {
  id: number;
  value: string;
};

export type IMemo = {
  id: number;
  content: string;
  tags: ITag[];
};
