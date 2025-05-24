import { Link, useParams } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import { MemoNode } from "../core/memoService";
import { di } from "../di";
import { useState } from "react";

const MEMO_LIST_OPEN_CONFIG_KEY = "memoListOpenConfig";
const memoListOpenConfig: Record<string, boolean> = {};

function loadConfig() {
  const config = localStorage.getItem(MEMO_LIST_OPEN_CONFIG_KEY);
  if (!config) return;
  const parsed = JSON.parse(config);
  Object.assign(memoListOpenConfig, parsed);
}

function saveConfig() {
  localStorage.setItem(
    MEMO_LIST_OPEN_CONFIG_KEY,
    JSON.stringify(memoListOpenConfig)
  );
}

loadConfig();

function MemoItem(node: MemoNode) {
  const { id: currentMemo } = useParams();
  const { id, children } = node;
  const title = node.title || "Untitled";
  const isSelected = `${id}` === currentMemo;
  const [isOpen, setIsOpen] = useState(memoListOpenConfig[id] ?? true);

  return (
    <div className="relative flex flex-col">
      {children.length > 0 && (
        <button
          className="opacity-50 absolute top-0 left-0 translate-x-[-100%] duration-200 pl-2 rounded outline-none hover:opacity-100"
          onClick={() => {
            setIsOpen(!isOpen);
            memoListOpenConfig[id] = !isOpen;
            saveConfig();
          }}>
          <code>{isOpen ? "-" : "+"}</code>
        </button>
      )}
      <Link
        className="opacity-70 text-sm rounded duration-200 w-full py-1 px-2 truncate hover:opacity-100"
        to={`/memo/${id}`}>
        {isSelected ? <strong>{title}</strong> : title}
      </Link>
      {isOpen && children.length > 0 && (
        <div className="mb-4 pl-4">
          {children.map((c) => (
            <MemoItem key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}

export function MemoList() {
  const service = useObservable(di.memoService);
  const memoTree = service.getMemoTree();
  return (
    <div>
      {memoTree.children.map((c) => (
        <MemoItem key={c.id} {...c} />
      ))}
    </div>
  );
}
