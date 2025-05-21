import { DefaultService, Memo, MemoSummary } from "../api";
import { MemoRepository } from "../core/model/memo";
import { timeout } from "./timeout";

export class MemoRepositoryImpl implements MemoRepository {
  private api = DefaultService;

  async listMemos(request: { authorization: string }): Promise<MemoSummary[]> {
    return await timeout(this.api.listMemo(request));
  }

  async createMemo(request: { authorization: string }): Promise<Memo> {
    return await timeout(this.api.createMemo(request));
  }

  async findMemo(request: {
    authorization: string;
    memoId: number;
  }): Promise<Memo> {
    return await timeout(this.api.findMemo(request));
  }

  async updateMemo(request: {
    authorization: string;
    memo: Memo;
    previousHash: string;
  }): Promise<Memo> {
    return await timeout(
      this.api.updateMemo({
        memoId: request.memo.id,
        authorization: request.authorization,
        requestBody: {
          memo: request.memo,
          previousHash: request.previousHash,
        },
      })
    );
  }

  async deleteMemo(request: {
    authorization: string;
    memoId: number;
  }): Promise<void> {
    return await timeout(this.api.deleteMemo(request));
  }

  async listBackups(request: { authorization: string }): Promise<string[]> {
    return await timeout(this.api.listBackups(request));
  }

  async createBackup(request: { authorization: string }): Promise<void> {
    return await timeout(this.api.backupMemo(request));
  }
}
