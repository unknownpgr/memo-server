import fs from "fs/promises";
import { Memo, MemoSummary, memoSchema } from "../core/entity";
import { Repository } from "../core/repository";

export class JsonFileRepository implements Repository {
  private memoStorage: Memo[] | null = null;

  constructor(private databaseDir: string = "/db") {}

  public async init() {
    let data;
    try {
      data = await fs.readFile(`${this.databaseDir}/memo.json`, "utf-8");
    } catch (e) {
      console.log("No memo database found. Creating a new one.");
      this.memoStorage = [];
      await fs.mkdir(this.databaseDir, { recursive: true });
      await this.save();
      return;
    }

    let rawMemos;
    try {
      rawMemos = JSON.parse(data);
    } catch (e) {
      console.error(e);
      console.error(data);
      throw new Error("Memo database is not a valid JSON file.");
    }

    try {
      this.memoStorage = rawMemos.map((memo: any) => memoSchema.parse(memo));
    } catch (e) {
      console.error(e);
      console.error(rawMemos);
      throw new Error("Memo database is corrupted.");
    }
  }

  private async save() {
    await fs.writeFile(
      `${this.databaseDir}/memo.json`,
      JSON.stringify(this.memoStorage, null, 2)
    );
  }

  private createMemoId() {
    if (!this.memoStorage) throw new Error("DB not loaded");
    let maxId = 0;
    for (const memo of this.memoStorage) {
      maxId = Math.max(maxId, memo.id);
    }
    return maxId + 1;
  }

  async findMemo({ memoId }: { memoId: number }): Promise<Memo> {
    if (!this.memoStorage) throw new Error("DB not loaded");
    const memo = this.memoStorage.find((memo) => memo.id === memoId);
    if (!memo) throw new Error("Not found");
    return memo;
  }

  async listMemo(): Promise<MemoSummary[]> {
    if (!this.memoStorage) throw new Error("DB not loaded");
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
    if (!this.memoStorage) throw new Error("DB not loaded");
    const memo: Memo = {
      id: this.createMemoId(),
      parentId: 0,
      title: "",
      content: "",
      hash: "",
      createdAt: "",
      updatedAt: "",
    };
    this.memoStorage.push(memo);
    await this.save();
    return memo;
  }

  async updateMemo({ memo }: { userId: number; memo: Memo }): Promise<Memo> {
    if (!this.memoStorage) throw new Error("DB not loaded");
    const index = this.memoStorage.findIndex((m) => m.id === memo.id);
    if (index === -1) throw new Error("Not found");
    this.memoStorage[index] = memo;
    await this.save();
    return memo;
  }

  async deleteMemo({
    memoId,
  }: {
    userId: number;
    memoId: number;
  }): Promise<void> {
    if (!this.memoStorage) throw new Error("DB not loaded");
    const index = this.memoStorage.findIndex((m) => m.id === memoId);
    if (index === -1) throw new Error("Not found");
    this.memoStorage.splice(index, 1);
    await this.save();
  }

  async createBackup(): Promise<void> {
    const backupPath = `${this.databaseDir}/memo-${Date.now()}.json`;
    await fs.writeFile(backupPath, JSON.stringify(this.memoStorage, null, 2));
  }

  async listBackups(): Promise<string[]> {
    const files = await fs.readdir(this.databaseDir);
    return files
      .filter((file) => file.startsWith("memo-"))
      .map((file) => file.replace("memo-", "").replace(".json", ""));
  }
}
