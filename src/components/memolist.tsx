import Link from "next/link";
import React from "react";
import { MemoWithTags } from "../types";
import Tag from "../components/tag";
import styles from "../styles/memolist.module.css";

export default function MemoList({ memos }: { memos: MemoWithTags[] }) {
  return (
    <ol>
      {memos.map(({ id, content, tags }) => (
        <li key={id} className={styles.item}>
          <div>
            <Link href={`/memo/${id}`}>{content || "NO CONTENT"}</Link>
          </div>
          <div className={styles.tags}>
            {tags.map(({ id, value }) => (
              <Tag key={id} value={value}></Tag>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
