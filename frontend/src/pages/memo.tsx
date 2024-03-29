import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Memo, MemoSummary } from "../api";
import { MemoSelector } from "../components/memoselector";
import { MemoService, memoService } from "../service";
import styles from "./memo.module.css";

marked.use(markedKatex({ throwOnError: false }));

class MemoEditorService {
  private memo: Memo | null = null;
  private isLoading = false;
  private isSaving = false;
  private listeners: (() => void)[] = [];
  private debounce: number | null = null;
  private viewMode: "preview" | "edit" = "preview";

  constructor(private service: MemoService, private memoId: number) {
    if (memoId < 0) throw new Error("invalid number");
    this.load();
  }

  public addListener(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public notify() {
    this.listeners.forEach((l) => l());
  }

  private async load() {
    if (this.isLoading) return;
    this.isLoading = true;
    const memo = await this.service.findMemo(this.memoId);
    this.memo = memo;
    this.isLoading = false;
    this.notify();
  }

  private async save() {
    this.isSaving = true;
    this.notify();
    if (this.debounce !== null) {
      clearTimeout(this.debounce);
    }
    this.debounce = setTimeout(async () => {
      this.debounce = null;
      if (this.memo === null) return;
      await this.service.updateMemo(this.memo);
      this.isSaving = false;
      this.notify();
    }, 1000);
  }

  public getMemoId() {
    return this.memoId;
  }

  public getIsLoading() {
    return this.isLoading;
  }

  public getIsSaving() {
    return this.isSaving;
  }

  public getContent() {
    return this.memo?.content ?? "";
  }

  public async setContent(content: string) {
    this.memo!.content = content;
    this.save();
    this.notify();
  }

  public getTitle() {
    return this.memo?.title ?? "";
  }

  public setTitle(title: string) {
    this.memo!.title = title;
    this.save();
    this.notify();
  }

  public getParentId() {
    return this.memo?.parentId ?? -1;
  }

  public async setParentId(parentId: number) {
    const list = await this.service.listMemo();
    let current = parentId;
    while (current !== 0) {
      if (current === this.memoId) {
        alert("Circular reference detected");
        return;
      }
      const memo = list.find((memo) => memo.id === current);
      if (!memo) break;
      current = memo.parentId;
    }

    this.memo!.parentId = parentId;
    this.save();
    this.notify();
  }

  public setViewMode(mode: "preview" | "edit") {
    this.viewMode = mode;
    this.notify();
  }

  public getViewMode() {
    return this.viewMode;
  }
}

function useMemoEditorService(service: MemoService, number: number) {
  const [, setCount] = useState(0);
  const ref = useRef<MemoEditorService | null>(null);
  if (ref.current === null)
    ref.current = new MemoEditorService(service, number);
  useEffect(() => {
    ref.current = new MemoEditorService(service, number);
    setCount((c) => c + 1);
    const listener = () => setCount((c) => c + 1);
    return ref.current!.addListener(listener);
  }, [service, number]);
  return ref.current;
}

const service = memoService;

function Path({ id }: { id: number }) {
  const [memoList, setMemoList] = useState<MemoSummary[]>([]);

  useEffect(() => {
    async function refresh() {
      const res = await service.listMemo();
      setMemoList(res);
    }
    refresh();
  }, []);

  const path = useMemo(() => {
    const path = [];
    let current = id;
    for (;;) {
      const memo = memoList.find((memo) => memo.id === current);
      if (!memo) break;
      path.push(memo.title);
      current = memo.parentId;
    }
    if (path.length === 0) return "Set path";
    return path.reverse().join("/");
  }, [id, memoList]);

  return path;
}

export default function MemoView({ memoId }: { memoId: number }) {
  const editorService = useMemoEditorService(service, memoId);
  const viewMode = editorService.getViewMode();
  const [showSelector, setShowSelector] = useState(false);
  const navigate = useNavigate();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleResizeTextArea = useCallback(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const height = textArea.scrollHeight;
      textArea.style.height = `${height}px`;
    }
  }, []);

  const handleDeleteMemo = useCallback(async () => {
    const message = `Do you really want to delete memo [${editorService.getTitle()}]?`;
    if (!confirm(message)) return;
    await service.deleteMemo(memoId);
    navigate("/");
  }, [memoId, editorService, navigate]);

  const handleMemoSave = useCallback(async () => {
    editorService.setViewMode("preview");
  }, [editorService]);

  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      const shouldSave =
        // Windows
        (e.ctrlKey && e.key === "s") ||
        // Mac
        (e.metaKey && e.key === "s");

      if (shouldSave) {
        e.preventDefault();
        handleMemoSave();
      }
    },
    [handleMemoSave]
  );

  useEffect(() => {
    handleResizeTextArea();
  }, [handleResizeTextArea, viewMode]);
  handleResizeTextArea();

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.titleInput}
        placeholder="Title"
        value={editorService.getTitle()}
        onChange={(e) => editorService.setTitle(e.target.value)}
      />
      <div className={styles.toolbar}>
        <button
          className={styles.toolbarItem}
          onClick={() => setShowSelector(true)}>
          <Path id={editorService.getParentId()} />
        </button>
        &nbsp;|&nbsp;
        {
          {
            edit: (
              <button
                className={styles.toolbarItem}
                onClick={() => editorService.setViewMode("preview")}>
                Preview
              </button>
            ),
            preview: (
              <button
                className={styles.toolbarItem}
                onClick={() => editorService.setViewMode("edit")}>
                Edit
              </button>
            ),
          }[viewMode]
        }
        &nbsp;|&nbsp;
        <button className={styles.toolbarItem} onClick={handleDeleteMemo}>
          Delete
        </button>
      </div>
      {viewMode === "edit" && (
        <textarea
          ref={textAreaRef}
          className={styles.contentEditor}
          value={editorService.getContent()}
          placeholder="Content"
          onChange={(e) => editorService.setContent(e.target.value)}
          onKeyDown={handleOnKeyDown}></textarea>
      )}
      {viewMode === "preview" && (
        <div
          className={styles.contentPreview}
          style={{ minHeight: "100px" }}
          dangerouslySetInnerHTML={{
            __html: marked(editorService.getContent()),
          }}
        />
      )}
      {showSelector && (
        <div className={styles.selector} onClick={() => setShowSelector(false)}>
          <div className={styles.selectorContent}>
            <MemoSelector
              onSelect={(id) => {
                editorService.setParentId(id);
                setShowSelector(false);
                editorService.notify();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
