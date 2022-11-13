import { KeyboardEvent, useState } from "react";

import Head from "next/head";
import { Tag as ITag } from "@prisma/client";
import MemoList from "../components/memolist";
import { MemoWithTags } from "../types";
import Tag from "../components/tag";
import TagInput from "../components/taginput";
import memoStyles from "../styles/memo.module.css";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { listMemo, listTags } from "../logic/logic";
import { del, get, post } from "../api";

interface IHomeProps {
  initialMemos: Omit<MemoWithTags, "createdAt" | "updatedAt">[];
  initialTags: Omit<ITag, "createdAt" | "updatedAt">[];
}

export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const [initialMemos, initialTags] = await Promise.all([
    listMemo(),
    listTags(),
  ]);
  return {
    props: {
      initialMemos,
      initialTags,
    },
  };
};

export default function Home({
  initialMemos,
  initialTags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [memos, setMemos] = useState(initialMemos);
  const [tagList, setTagList] = useState(initialTags);

  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  async function update() {
    const [memos, tags] = await Promise.all([
      get("/api/memo"),
      get("/api/tag"),
    ]);
    setMemos(memos);
    setTagList(tags);
  }

  async function createMemo() {
    setContent("");
    await post("/api/memo/create", { content, tags });
    update();
  }

  async function onDeleteMemo(id: number) {
    if (!confirm(`Do you really want to delete memo ${id}?`)) return;
    await del(`/api/memo/${id}`);
    update();
  }

  async function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && e.shiftKey) {
      createMemo();
      e.preventDefault();
    }
  }

  function onTagSelected(tag: string) {
    if (tags.indexOf(tag) >= 0) {
      setTags((tags) => tags.filter((x) => x !== tag));
    } else {
      setTags((tags) => [...tags, tag]);
    }
  }

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
        <button disabled={!content} onClick={createMemo}>
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
        <Tag
          key={id}
          value={value}
          onClick={() => onTagSelected(value)}
          disabled={tags.indexOf(value) >= 0}
        ></Tag>
      ))}
      <div>- - - - - - - - </div>
      <MemoList
        memos={memos.filter((memo) => {
          if (tags.length === 0) return true;
          const memoTags = new Set(memo.tags.map((x) => x.value));
          for (const tag of tags) if (!memoTags.has(tag)) return false;
          return true;
        })}
        onDeleteMemo={onDeleteMemo}
      />
    </div>
  );
}
