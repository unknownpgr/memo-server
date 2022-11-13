import Link from "next/link";
import { MemoWithTags } from "../types";
import React from "react";
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
          <div>
            <Link href={`/memo/${id}`}>
              <span>#{id}.</span>
              <button
                className={styles.delete}
                onClick={() => onDeleteMemo(id)}
              >
                [ X ]
              </button>
              {tags.map(({ id, value }) => (
                <Tag key={id} value={value}></Tag>
              ))}
              <div>{content || "NO CONTENT"}</div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
