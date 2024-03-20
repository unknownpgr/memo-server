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
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Editor, defaultValueCtx, rootCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { commonmark } from "@milkdown/preset-commonmark";
import { history } from "@milkdown/plugin-history";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import "@milkdown/theme-nord/style.css";
import { math } from "@milkdown/plugin-math";
import { indent } from "@milkdown/plugin-indent";
import { trailing } from "@milkdown/plugin-trailing";

class MemoEditorService {
  private memo: Memo | null = null;
  private isLoading = false;
  private isSaving = false;
  private listeners: (() => void)[] = [];
  private debounce: number | null = null;

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

const MilkdownEditor = ({ service }: { service: MemoEditorService }) => {
  const onUpdated = useCallback(
    (markdown: string) => service.setContent(markdown),
    [service]
  );

  useEditor(
    (root) => {
      const editor = Editor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, service.getContent() || "No content");
          ctx
            .get(listenerCtx)
            .markdownUpdated((_, markdown) => onUpdated(markdown));
        })
        .use(listener)
        .use(history)
        .use(commonmark)
        .use(math)
        .use(indent)
        .use(trailing);
      return editor;
    },
    [onUpdated]
  );
  return <Milkdown />;
};

export default function MemoView({ memoId }: { memoId: number }) {
  const editorService = useMemoEditorService(service, memoId);
  const [showSelector, setShowSelector] = useState(false);
  const navigate = useNavigate();

  const handleDeleteMemo = useCallback(async () => {
    const message = `Do you really want to delete memo [${editorService.getTitle()}]?`;
    if (!confirm(message)) return;
    await service.deleteMemo(memoId);
    navigate("/");
  }, [memoId, editorService, navigate]);

  const handleOnKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const isSave =
      // Windows
      (e.ctrlKey && e.key === "s") ||
      // Mac
      (e.metaKey && e.key === "s");
    if (isSave) {
      e.preventDefault();
    }
  }, []);

  return (
    <div onKeyDown={handleOnKeyDown}>
      <input
        className="text-4xl font-bold w-full mb-4"
        type="text"
        placeholder="Title"
        value={editorService.getTitle()}
        onChange={(e) => editorService.setTitle(e.target.value)}
      />
      <div className="text-sm text-gray-500 mb-4">
        <button onClick={() => setShowSelector(true)}>
          <Path id={editorService.getParentId()} />
        </button>
        &nbsp; | &nbsp;
        <button onClick={handleDeleteMemo}>Delete</button>
      </div>
      <div>
        {editorService.getIsLoading() ? (
          <div>Loading...</div>
        ) : (
          <MilkdownProvider>
            <MilkdownEditor service={editorService} />
          </MilkdownProvider>
        )}
      </div>
      {showSelector && (
        <div
          className="absolute w-full h-full p-8 left-0 top-0 z-20 backdrop-filter backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setShowSelector(false)}
        >
          <div className="w-full max-w-4xl h-full max-h-full overflow-scroll p-16 bg-white border rounded-lg shadow-lg">
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
