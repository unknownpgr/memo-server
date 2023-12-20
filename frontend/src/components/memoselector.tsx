import { useEffect, useState } from "react";
import { MemoNode, memoService } from "../service";
import { Link } from "react-router-dom";
import styles from "./memoselector.module.css";

const service = memoService;

function Item({ memo }: { memo: MemoNode }) {
  return (
    <div className={styles.item}>
      <Link className={styles.title} to={`/memo/${memo.id}`}>
        {memo.title}
      </Link>
      <div className={styles.children}>
        {memo.children.map((c) => (
          <Item key={c.id} memo={c} />
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
        <Item key={c.id} memo={c} />
      ))}
    </div>
  );
}
