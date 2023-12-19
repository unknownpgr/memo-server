import { Link } from "react-router-dom";
import { MemoSummary } from "../api";
import styles from "./memolist.module.css";

export default function MemoList({
  memos,
  onDeleteMemo,
}: {
  memos: MemoSummary[];
  onDeleteMemo: (number: number) => void;
}) {
  return (
    <div>
      {memos.map(({ id, title }) => (
        <div key={id} className={styles.item}>
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <button className={styles.delete} onClick={() => onDeleteMemo(id)}>
              Delete
            </button>
          </div>
          <div>
            <Link to={`/memo/${id}`}>
              <div className={styles.content}>...</div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
