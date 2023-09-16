import Link from "next/link";
import { IMemo } from "../global";
import React from "react";
import Tag from "./tag";
import styles from "./memolist.module.css";

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
          <div className={styles.header}>
            <h3 className={styles.title}>#{number}</h3>
            {tags.map(({ id, value }, i) => (
              <i className={styles.tag} key={id}>
                {value}
                {i < tags.length - 1 && ","}
              </i>
            ))}
            <button
              className={styles.delete}
              onClick={() => onDeleteMemo(number)}
            >
              Delete
            </button>
          </div>
          <div>
            <Link href={`/memo/${number}`}>
              <div className={styles.content}>
                {content.replace(/\r|\n|\t/g, " ").replace(/ +/g, " ") ||
                  "This memo has no content at all."}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
