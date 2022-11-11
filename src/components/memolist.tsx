import Link from "next/link";
import React from "react";
import { MemoWithTags } from "../types";
import Tag from "../components/tag";
import styles from "../styles/memolist.module.css";

export default function MemoList({
  memos,
  onDeleteMemo,
}: {
  memos: MemoWithTags[];
  onDeleteMemo: (id: number) => void;
}) {
  return (
    <div>
      {memos.map(({ id, content, tags }) => (
        <div key={id} className={styles.item}>
          <div className={styles.row}>
            <span className={styles.id}>#{id}.</span>
            <Link className={styles.preview} href={`/memo/${id}`}>
              {content || "NO CONTENT"}
            </Link>
            <button onClick={() => onDeleteMemo(id)}>X</button>
          </div>
          <div className={styles.tags}>
            {tags.map(({ id, value }) => (
              <Tag key={id} value={value}></Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
