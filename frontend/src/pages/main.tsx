import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Memo } from "../api";
import { Header } from "../components/header";
import MemoList from "../components/memolist";
import Tag from "../components/tag";
import TagSelector from "../components/tagSelector";
import { MemoService } from "../service";
import styles from "./main.module.css";

export default function Home({ service }: { service: MemoService }) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const naviate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    console.log("refresh");
    const res = await service.listMemo();
    const { memos, tags } = res;
    setMemos(memos);
    setTagList(tags);
  }

  async function createMemo() {
    const newMemo = await service.createMemo("This is a new memo", []);
    naviate(`/memo/${newMemo.number}`);
  }

  async function deleteMemo(number: number) {
    if (!confirm(`Do you really want to delete memo ${number}?`)) return;
    await service.deleteMemo(number);
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

  const mergedTags = Array.from(new Set([...tagList, ...selectedTags]));

  return (
    <div className={styles.container}>
      <Header service={service} />
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
          const memoTags = new Set(memo.tags);
          for (const tag of selectedTags) if (!memoTags.has(tag)) return false;
          return true;
        })}
        onDeleteMemo={deleteMemo}
      />
      <footer className={styles.footer}>© 2023 Copyright : Unknownpgr</footer>
    </div>
  );
}
