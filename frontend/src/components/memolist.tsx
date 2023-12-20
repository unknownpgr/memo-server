import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MemoNode, memoService } from "../service";
import styles from "./memolist.module.css";

const service = memoService;

function MemoItem({ id, title, children }: MemoNode) {
  return (
    <div className={styles.item}>
      <Link className={styles.title} to={`/memo/${id}`}>
        {title}
      </Link>
      <div className={styles.children}>
        {children.map((c) => (
          <MemoItem key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}

export default function MemoList() {
  const [memoTree, setMemoTree] = useState<MemoNode>({
    id: 0,
    title: "",
    children: [],
  });

  useEffect(() => {
    async function refresh() {
      const memoTree = await service.getMemoTree();
      setMemoTree(memoTree);
    }
    refresh();
  }, []);

  return (
    <div className={styles.list}>
      {memoTree.children.map((c) => (
        <MemoItem key={c.id} {...c} />
      ))}
    </div>
  );
}
