import { AuthService } from "./model/auth";
import { Memo, MemoRepository, MemoSummary } from "./model/memo";
import { Observable } from "./model/observable";

export interface MemoNode {
  id: number;
  title: string;
  children: MemoNode[];
}

export type MemoEvent =
  | "StateChange"
  | "MemoLoaded"
  | "MemoUpdated"
  | "ListUpdate";

export type MemoState = "idle" | "loading" | "updating";

export class MemoService extends Observable<MemoEvent> {
  constructor(
    private readonly api: MemoRepository,
    private readonly authService: AuthService
  ) {
    super();

    if (authService.getAuthState() === "authorized") {
      this.loadMemoList();
      this.loadBackupList();
    }
    authService.addListener(() => {
      if (authService.getAuthState() === "authorized") {
        this.loadMemoList();
        this.loadBackupList();
      }
    });
  }
  // Memo-related

  private memoList: MemoSummary[] = [];
  private currentMemo: Memo | null = null;
  private memoState: MemoState = "idle";
  private updateDebounce: number | null = null;

  private async loadMemoList() {
    const memoList = await this.api.listMemos({
      authorization: this.authService.getToken(),
    });
    this.memoList = memoList;
    this.notify("ListUpdate");
  }

  public async loadMemo(memoId: number) {
    if (this.memoState !== "idle") return;
    if (this.currentMemo && this.currentMemo.id === memoId) return;
    this.currentMemo = null;
    this.memoState = "loading";
    this.notify("StateChange");
    const memo = await this.api.findMemo({
      memoId,
      authorization: this.authService.getToken(),
    });
    this.currentMemo = memo;
    this.notify("MemoLoaded");
    this.memoState = "idle";
    this.notify("StateChange");
  }

  public async createMemo() {
    const newMemo = await this.api.createMemo({
      authorization: this.authService.getToken(),
    });
    await this.loadMemoList();
    return newMemo;
  }

  private async updateMemoSync(): Promise<void> {
    if (!this.currentMemo) return;
    await this.api.updateMemo({
      authorization: this.authService.getToken(),
      memo: this.currentMemo,
    });
  }

  private async updateMemoDebounce() {
    if (!this.currentMemo) throw new Error("No memo loaded");
    this.memoState = "updating";
    this.notify("StateChange");
    if (this.updateDebounce) clearTimeout(this.updateDebounce);
    const id = setTimeout(async () => {
      if (this.updateDebounce !== id) {
        alert("THIS SHOULD NOT HAPPEN");
        return;
      }
      await this.updateMemoSync();
      if (this.updateDebounce !== id) return;
      this.memoState = "idle";
      this.notify("StateChange");
    }, 1000);
    this.updateDebounce = id;
  }

  public async deleteMemo(memoId: number) {
    await this.api.deleteMemo({
      memoId,
      authorization: this.authService.getToken(),
    });
    await this.loadMemoList();
  }

  public getMemoState() {
    return this.memoState;
  }

  // getters and setters

  public getTitle() {
    if (this.memoState === "loading") return "";
    return this.currentMemo?.title || "";
  }

  public async setTitle(title: string) {
    if (this.memoState === "loading") return;
    const currentMemo = this.currentMemo;
    if (!currentMemo) throw new Error("No memo loaded");
    currentMemo.title = title;

    // Update memo title in the memo list
    const memo = this.memoList.find((memo) => memo.id === currentMemo.id);
    if (memo) memo.title = title;

    this.updateMemoDebounce();
    this.notify("MemoUpdated");
  }

  public getContent() {
    if (this.memoState === "loading") return "";
    return this.currentMemo?.content || "";
  }

  public async setContent(content: string) {
    if (this.memoState === "loading") return;
    if (!this.currentMemo) throw new Error("No memo loaded");
    if (this.currentMemo.content === content) return;
    this.currentMemo.content = content;
    this.notify("MemoUpdated");
    await this.updateMemoDebounce();
  }

  public getParentId() {
    if (this.memoState === "loading") return -1;
    return this.currentMemo?.parentId || -1;
  }

  public async setParentId(parentId: number) {
    if (this.memoState === "loading") return;
    const currentMemo = this.currentMemo;
    if (!currentMemo) throw new Error("No memo loaded");

    // Check for circular reference
    let current = parentId;
    while (current !== 0) {
      if (current === currentMemo.id) {
        throw new Error("Circular reference detected");
      }
      const memo = this.memoList.find((memo) => memo.id === current);
      if (!memo) break;
      current = memo.parentId;
    }

    // Update parent ID in the memo list
    const memo = this.memoList.find((memo) => memo.id === currentMemo.id);
    if (memo) memo.parentId = parentId;

    // Set parent ID
    currentMemo.parentId = parentId;
    this.notify("MemoUpdated");
    await this.updateMemoSync();
    this.loadMemoList();
  }

  public getPath() {
    if (!this.currentMemo) return "X";
    const path = [];
    let current = this.currentMemo.id;
    for (;;) {
      const memo = this.memoList.find((memo) => memo.id === current);
      if (!memo) break;
      path.push(memo.title);
      current = memo.parentId;
    }
    if (path.length === 0) return "Set path";
    return "/" + path.reverse().join("/");
  }

  public getMemoTree() {
    function constructMemoTree(
      memos: MemoSummary[],
      currentId = 0,
      parents = new Set<number>()
    ): MemoNode {
      if (parents.has(currentId))
        throw new Error("Circular reference detected");
      const current = memos.find((m) => m.id === currentId);
      const children = memos.filter((m) => m.parentId === currentId);
      const newParents = new Set([...parents, currentId]);
      const nodes = children.map((c) =>
        constructMemoTree(memos, c.id, newParents)
      );
      return {
        id: currentId,
        title: current ? current.title : "",
        children: nodes,
      };
    }
    this.memoList.sort((a, b) => {
      if (a.title < b.title) return -1;
      else if (a.title > b.title) return 1;
      else return 0;
    });
    const memoTree = constructMemoTree(this.memoList);
    return memoTree;
  }

  // Backup-related

  private backupList: string[] | null = null;

  private async loadBackupList() {
    this.backupList = await this.api.listBackups({
      authorization: this.authService.getToken(),
    });
    this.notify("ListUpdate");
  }

  public getBackupList(): string[] {
    if (this.backupList === null) {
      this.loadBackupList();
      this.backupList = []; // To prevent multiple API calls
      return [];
    }
    return this.backupList;
  }

  public async createBackup() {
    await this.api.createBackup({ authorization: this.authService.getToken() });
    await this.loadBackupList();
  }
}
