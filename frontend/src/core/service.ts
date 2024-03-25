import { DefaultService, Memo, MemoSummary } from "../api";
import { Observable } from "./observable";

export interface MemoNode {
  id: number;
  title: string;
  children: MemoNode[];
}

/*
Memo service state machine:
- auth:
  - "unauthorized"
  - "verifying"
  - "authorized"

- memo:
  - "idle"
  - "loading"
  - "updating"
 */

export class MemoService extends Observable {
  // Global
  private api = DefaultService;

  constructor() {
    super();
    this.init();
  }

  private async init() {
    await this.verifyToken();
    if (this.authState === "authorized") {
      await this.loadMemoList();
    }
  }

  // Auth-related

  private token: string = "";
  private authState: "authorized" | "verifying" | "unauthorized" = "verifying";

  private async verifyToken(): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      this.authState = "unauthorized";
      this.notify();
      return;
    }

    try {
      await this.api.listMemo({ authorization: token });
      this.token = token;
      this.authState = "authorized";
      await this.loadMemoList();
    } catch (e) {
      this.authState = "unauthorized";
      this.notify();
    }
  }

  public async login(username: string, password: string): Promise<void> {
    if (this.authState === "authorized") return;
    if (this.authState === "verifying") return;

    this.authState = "verifying";
    this.notify();
    try {
      const token = await this.api.login({
        requestBody: { username, password },
      });
      localStorage.setItem("token", token);
      this.token = token;
      this.authState = "authorized";
      await this.loadMemoList();
    } catch {
      this.authState = "unauthorized";
      this.notify();
    }
  }

  public async logout(): Promise<void> {
    if (this.authState === "unauthorized") return;
    if (!this.token) return;
    await this.api.logout({ authorization: this.token });
    localStorage.removeItem("token");
    this.token = "";
    this.authState = "unauthorized";
    this.notify();
  }

  public async register(username: string, password: string): Promise<void> {
    await this.api.register({
      requestBody: { username, password },
    });
  }

  public getAuthState() {
    return this.authState;
  }

  // Memo-related

  private memoList: MemoSummary[] = [];
  private currentMemo: Memo | null = null;
  private memoState: "idle" | "loading" | "updating" = "idle";
  private updateDebounce: number | null = null;

  private async loadMemoList() {
    const memoList = await this.api.listMemo({
      authorization: this.token,
    });
    this.memoList = memoList;
    this.notify();
  }

  public async loadMemo(memoId: number) {
    this.currentMemo = null;
    this.memoState = "loading";
    this.notify();
    const memo = await this.api.findMemo({
      memoId,
      authorization: this.token,
    });
    this.currentMemo = memo;
    this.memoState = "idle";
    this.notify();
  }

  public async createMemo() {
    const newMemo = await this.api.createMemo({
      authorization: this.token,
    });
    await this.loadMemoList();
    return newMemo;
  }

  private async updateMemoSync(): Promise<void> {
    if (!this.currentMemo) return;
    await this.api.updateMemo({
      memoId: this.currentMemo.id,
      authorization: this.token,
      requestBody: { memo: this.currentMemo },
    });
  }

  private async updateMemoDebounce() {
    if (!this.currentMemo) throw new Error("No memo loaded");
    this.memoState = "updating";
    this.notify();
    if (this.updateDebounce) clearTimeout(this.updateDebounce);
    const id = setTimeout(async () => {
      if (this.updateDebounce !== id) {
        console.log("THIS SHOULD NOT HAPPEN");
        return;
      }
      await this.updateMemoSync();
      if (this.updateDebounce !== id) return;
      this.memoState = "idle";
      this.notify();
    }, 1000);
    this.updateDebounce = id;
  }

  public async deleteMemo(memoId: number) {
    await this.api.deleteMemo({
      memoId,
      authorization: this.token,
    });
    await this.loadMemoList();
  }

  public async setTitle(title: string) {
    if (this.memoState === "loading") return;
    if (!this.currentMemo) throw new Error("No memo loaded");
    this.currentMemo.title = title;
    this.notify();
    await this.updateMemoDebounce();
    this.loadMemoList();
  }

  public async setContent(content: string) {
    if (this.memoState === "loading") return;
    if (!this.currentMemo) throw new Error("No memo loaded");
    this.currentMemo.content = content;
    this.notify();
    await this.updateMemoDebounce();
  }

  public async setParentId(parentId: number) {
    if (this.memoState === "loading") return;
    if (!this.currentMemo) throw new Error("No memo loaded");

    // Check for circular reference
    let current = parentId;
    while (current !== 0) {
      if (current === this.currentMemo.id) {
        throw new Error("Circular reference detected");
      }
      const memo = this.memoList.find((memo) => memo.id === current);
      if (!memo) break;
      current = memo.parentId;
    }

    // Set parent ID
    this.currentMemo.parentId = parentId;
    this.notify();
    await this.updateMemoSync();
    this.loadMemoList();
  }

  public getCurrentMemo() {
    return this.currentMemo;
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
    return path.reverse().join("/");
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

  public getMemoState() {
    return this.memoState;
  }
}
