import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Memo } from "../api";
import { MemoService } from "../service";
import styles from "./memo.module.css";

marked.use(markedKatex({ throwOnError: false }));

function useMemoId() {
  const { id } = useParams();
  if (!id) return -1;
  return parseInt(id);
}

class MemoEditorService {
  private memo: Memo | null = null;
  private isLoading = false;
  private isSaving = false;
  private listeners: (() => void)[] = [];
  private debounce: number | null = null;
  private viewMode: "preview" | "edit" = "preview";

  constructor(private service: MemoService, private number: number) {
    if (number < 0) throw new Error("invalid number");
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
    const memo = await this.service.findMemo(this.number);
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

  public async updateContent(content: string) {
    this.memo!.content = content;
    this.save();
    this.notify();
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
    const listener = () => setCount((c) => c + 1);
    return ref.current!.addListener(listener);
  }, []);
  return ref.current;
}

export default function MemoView({ service }: { service: MemoService }) {
  const number = useMemoId();
  const editorService = useMemoEditorService(service, number);
  const isSaving = editorService.getIsSaving();
  const viewMode = editorService.getViewMode();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          # {number}
          {isSaving ? "*" : ""}
        </h2>
        <span>
          {
            {
              edit: (
                <button onClick={() => editorService.setViewMode("preview")}>
                  Preview
                </button>
              ),
              preview: (
                <button onClick={() => editorService.setViewMode("edit")}>
                  Edit
                </button>
              ),
            }[viewMode]
          }
          &nbsp;/&nbsp;
          <Link to="/">Home</Link>
        </span>
      </header>
      <div
        style={{
          overflow: "hidden",
          height: viewMode === "edit" ? "100%" : "0",
        }}
      >
        <textarea
          style={{ minHeight: "100rem" }}
          value={editorService.getContent()}
          onChange={(e) => editorService.updateContent(e.target.value)}
        ></textarea>
      </div>
      {viewMode === "preview" && (
        <div
          style={{ minHeight: "100px" }}
          dangerouslySetInnerHTML={{
            __html: marked(editorService.getContent()),
          }}
        />
      )}
    </div>
  );
}
