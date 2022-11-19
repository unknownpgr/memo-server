import Link from "next/link";
import { IMemo } from "../global";
import React from "react";
import Tag from "./Tag";
import styles from "../styles/memolist.module.css";

export default function MemoList({
  memos,
  onDeleteMemo,
}: {
  memos: IMemo[];
  onDeleteMemo: (id: number) => void;
}) {
  return (
    <div>
      {memos.map(({ id, content, tags }) => (
        <div key={id} className={styles.item}>
          <div>
            <strong>#{id}.</strong>
            <button onClick={() => onDeleteMemo(id)}>[ X ]</button>
            {tags.map(({ id, value }) => (
              <Tag key={id} value={value}></Tag>
            ))}
            <Link href={`/memo/${id}`}>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {content || "NO CONTENT"}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
