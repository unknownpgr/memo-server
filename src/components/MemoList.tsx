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
            Memo Number {number}, with tags{" "}
            {tags.map(({ id, value }, i) => (
              <>
                <Tag key={id} value={value}></Tag>
                {i < tags.length - 1 && ", "}
              </>
            ))}
            . Click
            <button onClick={() => onDeleteMemo(number)}>
              {"'delete'"}
            </button>{" "}
            to delete this memo.{" "}
            <Link href={`/memo/${number}`}>
              <span className={styles.content}>
                {content || "This memo has no content at all."}
              </span>
            </Link>
          </div>
          <br />
        </div>
      ))}
    </div>
  );
}
