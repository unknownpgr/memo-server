import { Link } from "react-router-dom";
import { MemoSummary } from "../api";
import styles from "./memolist.module.css";

interface MemoNode {
  id: number;
  title: string;
  children: MemoNode[];
}

function constructMemoTree(memos: MemoSummary[], currentId = 0): MemoNode {
  const current = memos.find((m) => m.id === currentId);
  const children = memos.filter((m) => m.parentId === currentId);
  const nodes = children.map((c) => constructMemoTree(memos, c.id));
  return {
    id: currentId,
    title: current ? current.title : "",
    children: nodes,
  };
}

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

export default function MemoList({ memos }: { memos: MemoSummary[] }) {
  const sortedMemoList = memos.sort((a, b) => {
    if (a.title < b.title) return -1;
    else if (a.title > b.title) return 1;
    else return 0;
  });

  const memoTree = constructMemoTree(sortedMemoList);

  return (
    <div>
      {memoTree.children.map((c) => (
        <MemoItem key={c.id} {...c} />
      ))}
    </div>
  );
}
