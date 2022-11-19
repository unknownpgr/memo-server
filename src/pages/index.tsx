import { KeyboardEvent, useEffect, useState } from "react";

import Head from "next/head";
import MemoList from "../components/MemoList";
import { IMemo, ITag } from "../global";
import Tag from "../components/Tag";
import TagSelector from "../components/TagSelector";
import memoStyles from "../styles/memo.module.css";
import { InferGetServerSidePropsType } from "next";
import { listMemo, listTags } from "../logic/logic";
import { onListMemo, onListTags, onUpsertMemo } from "./index.telefunc";
import { withSession } from "../session/withSession";
import { onGetUser } from "./login.telefunc";

// If IHomeProps is an interface, not a type, It occurrs error.
// I don't know why.
type IHomeProps = {
  initialMemos: IMemo[];
  initialTags: ITag[];
};

export const getServerSideProps = withSession<IHomeProps>(async (context) => {
  const { user } = context.req.session;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  const [initialMemos, initialTags] = await Promise.all([
    listMemo(user.id),
    listTags(user.id),
  ]);
  return {
    props: {
      initialMemos,
      initialTags,
    },
  };
});

export default function Home({
  initialMemos,
  initialTags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [memos, setMemos] = useState(initialMemos);
  const [tagList, setTagList] = useState(initialTags);

  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    (async () => {
      console.log(await onGetUser());
    })();
  }, []);

  async function update() {
    const [memos, tags] = await Promise.all([onListMemo(), onListTags()]);
    setMemos(memos);
    setTagList(tags);
  }

  async function createMemo() {
    setContent("");
    await onUpsertMemo(content, tags);
    update();
  }

  async function onDeleteMemo(id: number) {
    if (!confirm(`Do you really want to delete memo ${id}?`)) return;
    await onDeleteMemo(id);
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
      <TagSelector tags={tags} setTags={setTags}></TagSelector>
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
