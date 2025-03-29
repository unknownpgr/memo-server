import { DefaultService, Memo, MemoSummary } from "../api";
import { MemoRepository } from "../core/model/memo";

export class MemoRepositoryImpl implements MemoRepository {
  private api = DefaultService;

  async listMemos(request: { authorization: string }): Promise<MemoSummary[]> {
    return await this.api.listMemo(request);
  }

  async createMemo(request: { authorization: string }): Promise<Memo> {
    return await this.api.createMemo(request);
  }

  async findMemo(request: {
    authorization: string;
    memoId: number;
  }): Promise<Memo> {
    return await this.api.findMemo(request);
  }

  async updateMemo(request: {
    authorization: string;
    memo: Memo;
    previousHash: string;
  }): Promise<Memo> {
    return await this.api.updateMemo({
      memoId: request.memo.id,
      authorization: request.authorization,
      requestBody: { memo: request.memo, previousHash: request.previousHash },
    });
  }

  async deleteMemo(request: {
    authorization: string;
    memoId: number;
  }): Promise<void> {
    return await this.api.deleteMemo(request);
  }

  async listBackups(request: { authorization: string }): Promise<string[]> {
    return await this.api.listBackups(request);
  }

  async createBackup(request: { authorization: string }): Promise<void> {
    return await this.api.backupMemo(request);
  }
}
