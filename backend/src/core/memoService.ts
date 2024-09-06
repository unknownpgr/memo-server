import { Memo, MemoSummary } from "./entity";

export class MemoService {
  constructor(private readonly repository: Repository) {}
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
    const updatedMemo = await this.repository.updateMemo({ memo });
    return updatedMemo;
  }

  public async deleteMemo({ memoId }: { memoId: number }): Promise<void> {
    await this.repository.deleteMemo({ memoId });
  }
}
