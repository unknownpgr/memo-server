import Link from "next/link";
import React from "react";
import { MemoWithTags } from "../types";
import Tag from "../components/tag";

export default function MemoList({ memos }: { memos: MemoWithTags[] }) {
  return (
    <ol>
      {memos.map(({ id, content, tags }) => (
        <li key={id}>
          <div>
            <Link href={`/memo/${id}`}>{content || "NO CONTENT"}</Link>
          </div>
          <div>
            {tags.map(({ id, value }) => (
              <Tag key={id} value={value}></Tag>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
