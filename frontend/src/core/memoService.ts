import { MemoInstanceService, MemoInstanceState } from "./memoInstanceService";
import { AuthService } from "./model/auth";
import { MemoRepository, MemoSummary } from "./model/memo";
import { Observable } from "./model/observable";

export interface MemoNode {
  id: number;
  title: string;
  children: MemoNode[];
}

export type MemoServiceState = "uninitialized" | MemoInstanceState;

export class MemoService extends Observable {
  private currentMemo: MemoInstanceService | null = null;
  private memoList: MemoSummary[] = [];
  private memoTreeCache: MemoNode | null = null;

  constructor(
    private readonly api: MemoRepository,
    private readonly authService: AuthService
  ) {
    super();

    const init = async () => {
      await this.loadMemoList();
      this.loadBackupList();
      const firstMemoId = this.getFirstMemoId();
      if (firstMemoId !== -1) {
        await this.loadMemo(firstMemoId);
      }
      this.notify();
    };

    if (authService.getAuthState() === "authorized") init();
    authService.addListener(() => {
      if (authService.getAuthState() === "authorized") init();
    });
  }

  private async loadMemoList() {
    const memoList = await this.api.listMemos({
      authorization: this.authService.getToken(),
    });
    this.memoList = memoList;
    this.memoTreeCache = null;
    this.notify();
  }

  public async loadMemo(memoId: number) {
    // If the memo is already loaded, do nothing
    if (this.currentMemo?.getId() === memoId) return;

    // Remove all listeners from the current memo
    if (this.currentMemo) {
      this.currentMemo.removeAllListeners();
    }

    // Create a new memo instance
    this.currentMemo = new MemoInstanceService(
      this.authService,
      this.api,
      memoId
    );
    this.currentMemo.addListener(() => this.notify());

    this.notify();
  }

  public async createMemo() {
    const newMemo = await this.api.createMemo({
      authorization: this.authService.getToken(),
    });
    await this.loadMemoList();
    return newMemo;
  }

  public async deleteMemo(memoId: number) {
    await this.api.deleteMemo({
      memoId,
      authorization: this.authService.getToken(),
    });
    await this.loadMemoList();
  }

  public getServiceState(): MemoServiceState {
    if (!this.currentMemo) return "uninitialized";
    return this.currentMemo.getMemoState();
  }

  public getFirstMemoId(): number {
    const tree = this.getMemoTree();
    if (tree.children.length === 0) return -1;
    return tree.children[0].id;
  }

  // getters and setters

  public getTitle() {
    if (!this.currentMemo) return "Loading...";
    return this.currentMemo.getTitle();
  }

  public async setTitle(title: string) {
    const currentMemo = this.currentMemo;

    if (!currentMemo) return;
    currentMemo.setTitle(title);

    // Update memo title in the memo list
    const memo = this.memoList.find((memo) => memo.id === currentMemo.getId());
    if (memo) memo.title = title;

    // Invalidate memo tree cache
    this.memoTreeCache = null;

    this.notify();
  }

  public getContent() {
    if (!this.currentMemo) return "";
    return this.currentMemo.getContent();
  }

  public async setContent(content: string) {
    const currentMemo = this.currentMemo;

    if (!currentMemo) return;
    currentMemo.setContent(content);

    this.notify();
  }

  public getParentId() {
    if (!this.currentMemo) return -1;
    return this.currentMemo.getParentId();
  }

  public async setParentId(parentId: number) {
    const currentMemo = this.currentMemo;
    if (!currentMemo) throw new Error("No memo loaded");

    // Check for circular reference
    let current = parentId;
    while (current !== 0) {
      if (current === currentMemo.getId()) {
        throw new Error("Circular reference detected");
      }
      const memo = this.memoList.find((memo) => memo.id === current);
      if (!memo) break;
      current = memo.parentId;
    }

    // Update parent ID in the memo list
    const memo = this.memoList.find((memo) => memo.id === currentMemo.getId());
    if (memo) memo.parentId = parentId;

    // Set parent ID
    currentMemo.setParentId(parentId);

    // Invalidate memo tree cache
    this.memoTreeCache = null;

    this.notify();
    this.loadMemoList();
  }

  public getPath() {
    if (!this.currentMemo) return "X";
    const path = [];
    let current = this.currentMemo.getId();
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
    if (this.memoTreeCache) return this.memoTreeCache;

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
    this.memoTreeCache = memoTree;
    return memoTree;
  }

  public getError() {
    if (!this.currentMemo) return "";
    return this.currentMemo.getError();
  }

  // Backup-related

  private backupList: string[] | null = null;

  private async loadBackupList() {
    this.backupList = await this.api.listBackups({
      authorization: this.authService.getToken(),
    });
    this.notify();
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
