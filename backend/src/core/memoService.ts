import { Memo, memoSchema } from "./entity";
import { Repository } from "./repository";
import crypto from "crypto";

export class MemoService {
  constructor(private readonly repository: Repository) {
    this.init();
  }

  private async init() {
    const memos = await this.repository.listMemo();
    if (memos.length > 0) return;
    await this.createMemo();
  }

  private hashMemo(memo: Memo): string {
    const data = memo.title + memo.content;
    const hash = crypto.createHash("md5");
    hash.update(data);
    return hash.digest("hex");
  }

  public async findMemo({ memoId }: { memoId: number }): Promise<Memo> {
    return await this.repository.findMemo({ memoId });
  }

  public async listMemo() {
    return await this.repository.listMemo();
  }

  public async createMemo(): Promise<Memo> {
    const newMemo = await this.repository.createMemo();
    newMemo.createdAt = new Date().toISOString();
    newMemo.updatedAt = new Date().toISOString();
    newMemo.hash = this.hashMemo(newMemo);
    await this.repository.updateMemo({ memo: newMemo });
    return newMemo;
  }

  public async updateMemo({
    memo,
    previousHash,
  }: {
    memo: Memo;
    previousHash: string;
  }): Promise<Memo> {
    const originalMemo = await this.repository.findMemo({ memoId: memo.id });

    if (originalMemo.hash !== previousHash) {
      throw new Error("Hash mismatch");
    }

    const updatedMemo: Memo = {
      ...originalMemo,
      title: memo.title,
      content: memo.content,
      parentId: memo.parentId,
      updatedAt: new Date().toISOString(),
    };
    updatedMemo.hash = this.hashMemo(updatedMemo);

    return await this.repository.updateMemo({ memo: updatedMemo });
  }

  public async deleteMemo({ memoId }: { memoId: number }): Promise<void> {
    await this.repository.deleteMemo({ memoId });
  }

  public async backupMemo(): Promise<void> {
    await this.repository.createBackup();
  }

  public async listBackups(): Promise<string[]> {
    return await this.repository.listBackups();
  }
}
