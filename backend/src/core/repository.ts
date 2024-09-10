import { Memo, MemoSummary } from "./entity";

export interface Repository {
  findMemo({ memoId }: { memoId: number }): Promise<Memo>;
  listMemo(): Promise<MemoSummary[]>;
  createMemo(): Promise<Memo>;
  updateMemo({ memo }: { memo: Memo }): Promise<Memo>;
  deleteMemo({ memoId }: { memoId: number }): Promise<void>;
  createBackup(): Promise<void>;
  listBackups(): Promise<string[]>;
}
