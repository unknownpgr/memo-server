import { AuthService } from "./model/auth";
import { Memo, MemoRepository } from "./model/memo";
import { Observable } from "./model/observable";

export type MemoInstanceState =
  | "loading"
  | "idle"
  | "debouncing"
  | "savingModified"
  | "saving"
  | "error";

type MemoInstanceEvent =
  | "memoLoaded"
  | "memoLoadFailed"
  | "userModifiedMemo"
  | "debounceTimerExpired"
  | "memoSaved"
  | "memoSaveFailed"
  | "retryTimerExpired";

type MemoInstanceStateMachine = {
  [key in MemoInstanceState]: {
    [key in MemoInstanceEvent]?:
      | [MemoInstanceState]
      | [MemoInstanceState, () => void];
  };
};

class Timer extends Observable {
  private timer: number | null = null;

  constructor(private readonly timeout: number) {
    super();
  }

  public extend() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.notify();
    }, this.timeout);
  }
}

export class MemoInstanceService extends Observable {
  private memo: Memo | null = null;
  private error: string | null = null;
  private memoState: MemoInstanceState = "loading";
  private debounceTimer: Timer = new Timer(1000);
  private retryTimer: Timer = new Timer(3000);

  private stateMachine: MemoInstanceStateMachine = {
    loading: {
      memoLoaded: ["idle"],
      memoLoadFailed: ["error", () => this.retryTimer.extend()],
    },
    idle: {
      userModifiedMemo: ["debouncing", () => this.debounceTimer.extend()],
    },
    debouncing: {
      debounceTimerExpired: ["saving", () => this.saveMemo()],
      userModifiedMemo: ["debouncing", () => this.debounceTimer.extend()],
    },
    saving: {
      memoSaved: ["idle"],
      memoSaveFailed: ["error", () => this.retryTimer.extend()],
      userModifiedMemo: ["savingModified"],
    },
    savingModified: {
      memoSaved: ["debouncing", () => this.debounceTimer.extend()],
      memoSaveFailed: ["error", () => this.retryTimer.extend()],
    },
    error: {
      memoLoaded: ["idle"],
      memoLoadFailed: ["error", () => this.retryTimer.extend()],
      retryTimerExpired: ["error", () => this.loadMemo()],
    },
  };

  constructor(
    private readonly auth: AuthService,
    private readonly api: MemoRepository,
    private readonly memoId: number
  ) {
    super();

    this.debounceTimer.addListener(() => this.event("debounceTimerExpired"));
    this.retryTimer.addListener(() => this.event("retryTimerExpired"));

    this.loadMemo();
  }

  private async loadMemo() {
    try {
      this.memo = await this.api.findMemo({
        authorization: this.auth.getToken(),
        memoId: this.memoId,
      });
      this.event("memoLoaded");
    } catch (error) {
      this.error = `Failed to load memo: ${error}`;
      this.event("memoLoadFailed");
    }
  }

  private async saveMemo() {
    if (!this.memo) return;
    try {
      const newMemo = await this.api.updateMemo({
        authorization: this.auth.getToken(),
        memo: this.memo,
        previousHash: this.memo.hash,
      });
      this.memo.hash = newMemo.hash;
      this.event("memoSaved");
    } catch (error) {
      this.error = `Failed to save memo: ${error}`;
      this.event("memoSaveFailed");
    }
  }

  private event(event: MemoInstanceEvent) {
    const transition = this.stateMachine[this.memoState][event];
    if (!transition) return;
    this.memoState = transition[0];
    const nextState = transition[1];
    nextState?.();
    this.notify();
  }

  public getId() {
    if (!this.memo) return -1;
    return this.memo.id;
  }

  public getTitle() {
    if (!this.memo) return "";
    return this.memo.title;
  }

  public setTitle(title: string) {
    if (!this.memo) return;
    this.memo.title = title;
    this.event("userModifiedMemo");
  }

  public getContent() {
    if (!this.memo) return "";
    return this.memo.content;
  }

  public setContent(content: string) {
    if (!this.memo) return;
    if (this.memo.content === content) return;
    this.memo.content = content;
    this.event("userModifiedMemo");
  }

  public getParentId() {
    if (!this.memo) return -1;
    return this.memo.parentId;
  }

  public setParentId(parentId: number) {
    if (!this.memo) return;
    this.memo.parentId = parentId;
    this.event("userModifiedMemo");
  }

  public getMemoState() {
    return this.memoState;
  }

  public getError() {
    return this.error;
  }
}
