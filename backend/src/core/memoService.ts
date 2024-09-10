import { Memo, memoSchema } from "./entity";
import { Repository } from "./repository";

export class MemoService {
  constructor(private readonly repository: Repository) {
    this.initialize();
  }

  private async initialize() {
    const memos = await this.repository.listMemo();
    if (memos.length > 0) return;
    await this.repository.createMemo();
  }

  public async findMemo({ memoId }: { memoId: number }): Promise<Memo> {
    return await this.repository.findMemo({ memoId });
  }

  public async listMemo() {
    return await this.repository.listMemo();
  }

  public async createMemo(): Promise<Memo> {
    return await this.repository.createMemo();
  }

  public async updateMemo({ memo }: { memo: Memo }): Promise<Memo> {
    return await this.repository.updateMemo({ memo: memoSchema.parse(memo) });
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
