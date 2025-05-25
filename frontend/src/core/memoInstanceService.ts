import { AuthService } from "./model/auth";
import { Memo, MemoRepository } from "./model/memo";
import { Observable } from "./model/observable";

export type MemoState =
  | "loading"
  | "idle"
  | "debouncing"
  | "saving-modified"
  | "saving"
  | "error";

type MemoInstanceEvent =
  | "memo-loaded"
  | "memo-load-failed"
  | "user-modified-memo"
  | "debounce-timer-expired"
  | "memo-saved"
  | "memo-save-failed";

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
  private memoState: MemoState = "loading";
  private debounceTimer: Timer;

  constructor(
    private readonly auth: AuthService,
    private readonly api: MemoRepository,
    private readonly memoId: number
  ) {
    super();
    this.debounceTimer = new Timer(1000);
    this.debounceTimer.addListener(() => {
      this.transition("debounce-timer-expired");
    });

    this.loadMemo();
  }

  private async loadMemo() {
    try {
      this.memo = await this.api.findMemo({
        authorization: this.auth.getToken(),
        memoId: this.memoId,
      });
      this.transition("memo-loaded");
    } catch (error) {
      this.error = `Failed to load memo: ${error}`;
      this.transition("memo-load-failed");
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
      this.transition("memo-saved");
    } catch (error) {
      this.error = `Failed to save memo: ${error}`;
      this.transition("memo-save-failed");
    }
  }

  private transition(event: MemoInstanceEvent) {
    switch (this.memoState) {
      case "loading":
        {
          switch (event) {
            case "memo-loaded":
              this.memoState = "idle";
              break;
            case "memo-load-failed":
              this.memoState = "error";
              break;
          }
        }
        break;
      case "idle":
        {
          switch (event) {
            case "user-modified-memo":
              this.debounceTimer.extend();
              this.memoState = "debouncing";
              break;
          }
        }
        break;
      case "debouncing":
        {
          switch (event) {
            case "debounce-timer-expired":
              this.memoState = "saving";
              this.saveMemo();
              break;
            case "user-modified-memo":
              this.debounceTimer.extend();
              break;
          }
        }
        break;
      case "saving":
        {
          switch (event) {
            case "memo-saved":
              this.memoState = "idle";
              break;
            case "memo-save-failed":
              this.memoState = "error";
              break;
            case "user-modified-memo":
              this.memoState = "saving-modified";
              break;
          }
        }
        break;
      case "saving-modified":
        {
          switch (event) {
            case "memo-saved":
              this.debounceTimer.extend();
              this.memoState = "debouncing";
              break;
            case "memo-save-failed":
              this.memoState = "error";
              break;
          }
        }
        break;
      case "error":
        break;
    }
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
    this.transition("user-modified-memo");
  }

  public getContent() {
    if (!this.memo) return "";
    return this.memo.content;
  }

  public setContent(content: string) {
    if (!this.memo) return;
    if (this.memo.content === content) return;
    this.memo.content = content;
    this.transition("user-modified-memo");
  }

  public getParentId() {
    if (!this.memo) return -1;
    return this.memo.parentId;
  }

  public setParentId(parentId: number) {
    if (!this.memo) return;
    this.memo.parentId = parentId;
    this.transition("user-modified-memo");
  }

  public getMemoState() {
    return this.memoState;
  }

  public getError() {
    return this.error;
  }
}
