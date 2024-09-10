export interface Memo {
  id: number;
  title: string;
  parentId: number;
  content: string;
}

export interface MemoSummary {
  id: number;
  title: string;
  parentId: number;
}

export interface MemoRepository {
  listMemos(request: { authorization: string }): Promise<MemoSummary[]>;
  createMemo(request: { authorization: string }): Promise<Memo>;
  findMemo(request: { authorization: string; memoId: number }): Promise<Memo>;
  updateMemo(request: { authorization: string; memo: Memo }): Promise<void>;
  deleteMemo(request: { authorization: string; memoId: number }): Promise<void>;
  listBackups(request: { authorization: string }): Promise<string[]>;
  createBackup(request: { authorization: string }): Promise<void>;
}
