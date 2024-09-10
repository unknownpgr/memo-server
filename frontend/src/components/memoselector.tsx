import { useEffect, useState } from "react";
import { MemoNode } from "../core/service";
import { di } from "../di";

function Item({
  memo,
  onSelect,
}: {
  memo: MemoNode;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="text-lg">
      <button onClick={() => onSelect(memo.id)}>
        {memo.title || "Untitled"}
      </button>
      <div className="ml-8 my-2 text-lg">
        {memo.children.map((c) => (
          <Item key={c.id} memo={c} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export function MemoSelector({ onSelect }: { onSelect: (id: number) => void }) {
  const [memoTree, setMemoTree] = useState<MemoNode>({
    id: 0,
    title: "",
    children: [],
  });

  const service = di.service;

  useEffect(() => {
    const load = async () => {
      const memoTree = await service.getMemoTree();
      setMemoTree(memoTree);
    };
    load();
  }, [service]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Select Parent</h1>
      <button className="my-2 text-lg" onClick={() => onSelect(0)}>
        Select root
      </button>
      {memoTree.children.map((c) => (
        <Item key={c.id} memo={c} onSelect={onSelect} />
      ))}
    </div>
  );
}
