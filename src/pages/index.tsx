import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";
import MemoList from "../components/memolist";
import Tag from "../components/tag";
import TagSelector from "../components/tagSelector";
import { IMemo, ITag } from "../global";
import { listMemo, listTags } from "../logic/logic";
import { withSession } from "../session/withSession";
import {
  onCreateMemo,
  onDeleteMemo,
  onListMemo,
  onListTags,
} from "../telefunc/index.telefunc";
import { useRouter } from "next/router";
import styles from "./index.module.css";

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
    listMemo({ userId: user.id }),
    listTags({ userId: user.id }),
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();

  async function refresh() {
    const [memos, tags] = await Promise.all([onListMemo(), onListTags()]);
    setMemos(memos);
    setTagList(tags);
  }

  async function createMemo() {
    const newMemo = await onCreateMemo("", selectedTags);
    router.push(`/memo/${newMemo.number}`);
  }

  async function deleteMemo(number: number) {
    if (!confirm(`Do you really want to delete memo ${number}?`)) return;
    await onDeleteMemo(number);
    refresh();
  }

  function onTagSelected(tag: string) {
    if (selectedTags.indexOf(tag) >= 0) {
      setSelectedTags((tags) => tags.filter((x) => x !== tag));
    } else {
      setSelectedTags((tags) => [...tags, tag]);
    }
  }

  if (!memos || !tagList) return <h1>Loading</h1>;

  const mergedTags = Array.from(
    new Set([...tagList.map((x) => x.value), ...selectedTags])
  );

  return (
    <>
      <Head>
        <title>Memo</title>
        <meta name="description" content="Memo server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <button onClick={createMemo}>Create new memo</button>
      </div>
      <br />
      <h2>Tags</h2>
      <div>
        {mergedTags.map((value, i) => (
          <>
            <Tag
              key={i}
              value={value}
              onClick={() => onTagSelected(value)}
              disabled={selectedTags.indexOf(value) >= 0}
            ></Tag>
            {i < mergedTags.length - 1 && ", "}
          </>
        ))}
      </div>
      <br />
      <TagSelector tags={selectedTags} setTags={setSelectedTags}></TagSelector>

      <br />
      <br />
      <MemoList
        memos={memos.filter((memo) => {
          if (selectedTags.length === 0) return true;
          const memoTags = new Set(memo.tags.map((x) => x.value));
          for (const tag of selectedTags) if (!memoTags.has(tag)) return false;
          return true;
        })}
        onDeleteMemo={deleteMemo}
      />
      <footer className={styles.footer}>© 2023 Copyright : Unknownpgr</footer>
    </>
  );
}
