import { KeyboardEvent, useState } from "react";

import Head from "next/head";
import { Tag as ITag } from "@prisma/client";
import MemoList from "../components/memolist";
import { MemoWithTags } from "../types";
import Tag from "../components/tag";
import TagInput from "../components/taginput";
import memoStyles from "../styles/memo.module.css";
import useJSON from "../hooks/useJSON";

export default function Home() {
  const {
    data: memos,
    mutate: mutateMemo,
    error: err1,
    isValidating,
  } = useJSON<MemoWithTags[]>("/api/memo");
  const {
    data: tagList,
    mutate: mutateTagList,
    error: err2,
  } = useJSON<ITag[]>("/api/tag");

  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  async function createMemo() {
    setContent("");
    // Tags are not initialzed because same tags can be used for multiple memo.

    await fetch("/api/memo/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, tags }),
    });
    mutateMemo();
    mutateTagList();
  }

  async function onDeleteMemo(id: number) {
    if (!confirm(`Do you really want to delete memo ${id}`)) return;
    await fetch(`/api/memo/${id}`, {
      method: "delete",
    });
    mutateMemo();
  }

  async function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && e.shiftKey) {
      createMemo();
      e.preventDefault();
    }
  }

  if (err1 || err2) return <h1>Error</h1>;
  if (!memos || !tagList) return <h1>Loading</h1>;

  return (
    <div>
      <Head>
        <title>Memo</title>
        <meta name="description" content="Memo server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>
        Memo{" "}
        <button disabled={!content || isValidating} onClick={createMemo}>
          [ Create Memo ]
        </button>
      </h1>
      <textarea
        className={memoStyles.content}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={onKeyDown}
      ></textarea>
      <TagInput tags={tags} setTags={setTags}></TagInput>
      <div>- - - - - - - - </div>
      {tagList.map(({ id, value }) => (
        <Tag key={id} value={value}></Tag>
      ))}
      <div>- - - - - - - - </div>
      <MemoList memos={memos} onDeleteMemo={onDeleteMemo} />
    </div>
  );
}
