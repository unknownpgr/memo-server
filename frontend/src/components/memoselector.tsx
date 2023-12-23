import { useEffect, useState } from "react";
import { MemoNode, memoService } from "../service";
import styles from "./memoselector.module.css";

const service = memoService;

function Item({
  memo,
  onSelect,
}: {
  memo: MemoNode;
  onSelect: (id: number) => void;
}) {
  return (
    <div className={styles.item}>
      <button onClick={() => onSelect(memo.id)}>{memo.title}</button>
      <div className={styles.children}>
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

  useEffect(() => {
    const load = async () => {
      const memoTree = await service.getMemoTree();
      setMemoTree(memoTree);
    };
    load();
  }, []);

  return (
    <div>
      <h1>Select</h1>
      <button className={styles.root} onClick={() => onSelect(0)}>
        Select root
      </button>
      {memoTree.children.map((c) => (
        <Item key={c.id} memo={c} onSelect={onSelect} />
      ))}
    </div>
  );
}
