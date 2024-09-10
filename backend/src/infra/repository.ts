import fs from "fs/promises";
import { Memo, MemoSummary, memoSchema } from "../core/entity";
import { Repository } from "../core/repository";

export class JsonFileRepository implements Repository {
  private memoStorage: Memo[] = [];

  constructor(private databaseDir: string = "/db") {
    this.load();
  }

  private async load() {
    try {
      const data = await fs.readFile(`${this.databaseDir}/memo.json`, "utf-8");
      const memos = JSON.parse(data);
      this.memoStorage = memos.map((memo: any) => memoSchema.parse(memo));
    } catch (e) {
      console.log("No memo database found. Creating a new one.");
    }
  }

  private async save() {
    await fs.writeFile(
      `${this.databaseDir}/memo.json`,
      JSON.stringify(this.memoStorage, null, 2)
    );
  }

  private createMemoId() {
    let maxId = 0;
    for (const memo of this.memoStorage) {
      maxId = Math.max(maxId, memo.id);
    }
    return maxId + 1;
  }

  async findMemo({ memoId }: { memoId: number }): Promise<Memo> {
    const memo = this.memoStorage.find((memo) => memo.id === memoId);
    if (!memo) throw new Error("Not found");
    return memo;
  }

  async listMemo(): Promise<MemoSummary[]> {
    const results = this.memoStorage.map((memo) => {
      return {
        id: memo.id,
        parentId: memo.parentId,
        title: memo.title,
        createdAt: memo.createdAt,
        updatedAt: memo.updatedAt,
      };
    });
    results.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
    return results;
  }

  async createMemo(): Promise<Memo> {
    const memo: Memo = {
      id: this.createMemoId(),
      parentId: 0,
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoStorage.push(memo);
    await this.save();
    return memo;
  }

  async updateMemo({
    userId,
    memo,
  }: {
    userId: number;
    memo: Memo;
  }): Promise<Memo> {
    const index = this.memoStorage.findIndex((m) => m.id === memo.id);
    if (index === -1) throw new Error("Not found");
    this.memoStorage[index] = memo;
    await this.save();
    return memo;
  }

  async deleteMemo({
    userId,
    memoId,
  }: {
    userId: number;
    memoId: number;
  }): Promise<void> {
    const index = this.memoStorage.findIndex((m) => m.id === memoId);
    if (index === -1) throw new Error("Not found");
    this.memoStorage.splice(index, 1);
    await this.save();
  }

  async createBackup(): Promise<void> {
    const backupPath = `${this.databaseDir}/memo-${Date.now()}.json`;
    await fs.writeFile(backupPath, JSON.stringify(this.memoStorage));
  }
}
