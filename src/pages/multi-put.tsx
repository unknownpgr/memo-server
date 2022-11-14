import React, { memo, useState } from "react";
import { put } from "../api";
import Tag from "../components/Tag";

interface IMemo {
  id: number;
  content: string;
  tags: string[];
}

function parse(text: string) {
  const memos: IMemo[] = [];
  let currentMemo: null | IMemo = null;

  const lines = text.split("\n");
  for (const line of lines) {
    const f = line.charAt(0);
    switch (f) {
      case "#":
        if (currentMemo) {
          memos.push(currentMemo);
        }
        const id = +line
          .replace("#", "")
          .replace(".", "")
          .replace("[ X ]", "")
          .trim();
        currentMemo = { id, content: "", tags: [] };
        break;
      case "@":
        if (!currentMemo) continue;
        currentMemo.tags.push(line.replace("@", "").trim());
        break;
      default:
        if (!currentMemo) continue;
        if (currentMemo.content.length) currentMemo.content += "\n";
        currentMemo.content += line;
        break;
    }
  }
  return memos;
}

/**
 * This page is for memo recovery.
 */
export default function MultiPut() {
  const [text, setText] = useState("");

  const memos = parse(text);

  async function push() {
    for (const memo of memos) {
      const { id, content, tags } = memo;
      const res = await put(`/api/memo/create`, { content, tags });
      console.log(id, res);
    }
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div>
        <button onClick={push}>[ Push ]</button>
      </div>
      {memos.map(({ id, content, tags }) => (
        <div key={id}>
          <div>
            <strong>#{id}</strong>
            {tags.map((value) => (
              <Tag key={value} value={value}></Tag>
            ))}
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>
        </div>
      ))}
    </div>
  );
}
