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
  onDeleteMemo: (number: number) => void;
}) {
  return (
    <div>
      {memos.map(({ number, content, tags }) => (
        <div key={number} className={styles.item}>
          <div>
            <strong>#{number}.</strong>{" "}
            <button onClick={() => onDeleteMemo(number)}>[ X ]</button>{" "}
            {tags.map(({ id, value }) => (
              <Tag key={id} value={value}></Tag>
            ))}
            <Link href={`/memo/${number}`}>
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
