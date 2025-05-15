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
    <div className="mt-2">
      {children.length > 0 && (
        <button
          className="mr-2"
          onClick={() => {
            setIsOpen(!isOpen);
            memoListOpenConfig[id] = !isOpen;
            saveConfig();
          }}>
          <code>{isOpen ? "▼" : "▶"}</code>
        </button>
      )}
      <Link className="" to={`/memo/${id}`}>
        {isSelected ? <strong>{title}</strong> : title}
      </Link>
      {isOpen && (
        <div className="pl-4">
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
