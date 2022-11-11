import Head from "next/head";
import { useState } from "react";
import useJSON from "../hooks/useJSON";
import { MemoWithTags } from "../types";
import memoStyles from "../styles/memo.module.css";
import TagInput from "../components/taginput";
import { Tag as ITag } from "@prisma/client";
import MemoList from "../components/memolist";
import Tag from "../components/tag";

export default function Home() {
  const {
    data: memos,
    mutate: mutateMemo,
    error: err1,
  } = useJSON<MemoWithTags[]>("/api/memo");
  const {
    data: tagList,
    mutate: mutateTagList,
    error: err2,
  } = useJSON<ITag[]>("/api/tag");

  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  async function onCreateMemo() {
    await fetch("/api/memo/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, tags }),
    });
    setTags([]);
    setContent("");
    mutateMemo();
    mutateTagList();
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
      <h1>Memo</h1>
      <textarea
        className={memoStyles.content}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <h2>Tags</h2>
      <TagInput tags={tags} setTags={setTags}></TagInput>
      <button onClick={onCreateMemo}>Create Memo</button>
      <hr />
      {tagList.map(({ id, value }) => (
        <Tag key={id} value={value}></Tag>
      ))}
      <hr />
      <MemoList memos={memos} />
    </div>
  );
}
