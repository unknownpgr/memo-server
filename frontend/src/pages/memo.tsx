import EasyMDE from "easymde";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Tags from "../components/tagSelector";
import { MemoService } from "../service";
import styles from "./memo.module.css";
import { marked } from "marked";
import markedKatex from "marked-katex-extension";

marked.use(markedKatex({ throwOnError: false }));

function useMemoId() {
  const { id } = useParams();
  if (!id) return -1;
  return parseInt(id);
}

class MemoEditorService {
  private isLoading = false;
  private isSaving = false;
  private listeners: (() => void)[] = [];
  private content: string = "";
  private tags: string[] = [];
  private debounce: number | null = null;
  private editor: EasyMDE | null = null;
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
    this.content = memo.content;
    this.tags = memo.tags;
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
      await this.service.updateMemo(this.number, this.content, this.tags);
      this.isSaving = false;
      this.notify();
    }, 1000);
  }

  public setEditorElement(textArea: HTMLTextAreaElement | null) {
    if (this.isLoading) return;
    if (textArea === null) return;
    if (this.editor !== null) return;
    const easyMDE = new EasyMDE({
      element: textArea,
      autoDownloadFontAwesome: true,
      spellChecker: false,
      toolbar: false,
      scrollbarStyle: "null",
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
    });
    easyMDE.value(this.content);
    easyMDE.codemirror.on("change", () => this.updateContent(easyMDE.value()));
    this.editor = easyMDE;
  }

  public async updateContent(content: string) {
    this.content = content;
    this.save();
    this.notify();
  }

  public async updateTags(tags: string[]) {
    this.tags = tags;
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
    return this.content;
  }

  public getTags() {
    return this.tags;
  }

  public setViewMode(mode: "preview" | "edit") {
    if (this.editor === null) return;
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

export default function Memo({ service }: { service: MemoService }) {
  const number = useMemoId();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const editorService = useMemoEditorService(service, number);
  editorService.setEditorElement(textAreaRef.current);
  const isSaving = editorService.getIsSaving();
  const tags = editorService.getTags();
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
          &nbsp;
          <Link to="/">Home</Link>
        </span>
      </header>
      {/* 
       Use style `height` to hide editor instead of `display` or `hidden` attribute,
       because it will not be rendered when it is hidden.
       */}
      <div
        style={{
          overflow: "hidden",
          height: viewMode === "edit" ? "100%" : "0",
        }}
      >
        <textarea ref={textAreaRef}></textarea>
      </div>
      {viewMode === "preview" && (
        <div
          style={{ minHeight: "100px" }}
          dangerouslySetInnerHTML={{
            __html: marked(editorService.getContent()),
          }}
        />
      )}
      <h3>Tags</h3>
      <Tags tags={tags} setTags={(v) => editorService.updateTags(v)} />
    </div>
  );
}
