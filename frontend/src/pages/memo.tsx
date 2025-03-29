import { Editor, defaultValueCtx, rootCtx } from "@milkdown/core";
import { history } from "@milkdown/plugin-history";
import { indent } from "@milkdown/plugin-indent";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { math } from "@milkdown/plugin-math";
import { trailing } from "@milkdown/plugin-trailing";
import { commonmark } from "@milkdown/preset-commonmark";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";
import { KeyboardEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemoSelector } from "../components/memoselector";
import { di } from "../di";

const MilkdownEditor = () => {
  const service = di.memoService;

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
          ctx.set(defaultValueCtx, service.getContent());
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

export function MemoView({ memoId }: { memoId: number }) {
  const [showSelector, setShowSelector] = useState(false);
  const navigate = useNavigate();
  const service = di.memoService;
  const memoState = service.getServiceState();

  const isError = memoState === "error";
  const isUpdating =
    memoState === "debouncing" ||
    memoState === "saving" ||
    memoState === "saving-modified";

  const handleDeleteMemo = useCallback(async () => {
    const message = `Do you really want to delete memo [${service.getTitle()}]?`;
    if (!confirm(message)) return;
    await service.deleteMemo(memoId);
    navigate("/");
  }, [service, memoId, navigate]);

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

  if (isError) {
    return (
      <div className="w-full h-full flex justify-center items-center text-4xl font-bold">
        Error: {service.getError()}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" onKeyDown={handleOnKeyDown}>
      <input
        className="w-full text-4xl font-bold mb-4 outline-none"
        type="text"
        placeholder="Title"
        value={service.getTitle()}
        onChange={(e) => service.setTitle(e.target.value)}
      />
      <div className="flex text-sm text-gray-500 mb-4">
        <button onClick={() => setShowSelector(true)}>
          {service.getPath()}
        </button>
        &nbsp; | &nbsp;
        <button onClick={handleDeleteMemo}>Delete</button>
        {isUpdating && (
          <>
            &nbsp; | &nbsp;
            <span>Updating...</span>
          </>
        )}
      </div>
      <MilkdownProvider>
        <MilkdownEditor />
      </MilkdownProvider>
      {showSelector && (
        <div
          className="absolute w-full h-full p-8 left-0 top-0 z-20 backdrop-filter backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setShowSelector(false)}>
          <div className="w-full max-w-4xl h-full max-h-full overflow-scroll p-16 bg-white border rounded-lg shadow-lg">
            <MemoSelector
              onSelect={(id) => {
                service.setParentId(id);
                setShowSelector(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
