import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Memo } from "../api";
import { Header } from "../components/header";
import MemoList from "../components/memolist";
import Tag from "../components/tag";
import TagSelector from "../components/tagSelector";
import { MemoService } from "../service";
import styles from "./main.module.css";

function isHttpResponseError(
  error: unknown
): error is { response: { status: number } } {
  if (typeof error !== "object" || error === null) return false;
  const response = (error as { response: unknown }).response;
  if (typeof response !== "object" || response === null) return false;
  const status = (response as { status: unknown }).status;
  if (typeof status !== "number") return false;
  return true;
}

export default function Home({ service }: { service: MemoService }) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    if (!service.isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const res = await service.listMemo();
      const { memos, tags } = res;
      setMemos(memos);
      setTagList(tags);
    } catch (error: unknown) {
      if (isHttpResponseError(error) && error.response.status === 401) {
        navigate("/login");
      } else {
        alert("Unexpected error occurred");
        console.error(error);
      }
    }
  }, [navigate, service]);

  const createMemo = useCallback(async () => {
    const newMemo = await service.createMemo("This is a new memo", []);
    navigate(`/memo/${newMemo.number}`);
  }, [service, navigate]);

  const deleteMemo = useCallback(
    async (number: number) => {
      if (!confirm(`Do you really want to delete memo ${number}?`)) return;
      await service.deleteMemo(number);
      refresh();
    },
    [service, refresh]
  );

  const onTagSelected = useCallback(
    (tag: string) => {
      if (selectedTags.includes(tag)) {
        setSelectedTags((tags) => tags.filter((x) => x !== tag));
      } else {
        setSelectedTags((tags) => [...tags, tag]);
      }
    },
    [selectedTags]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

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
      <footer className={styles.footer}>© 2023 Copyright : UnknownPgr</footer>
    </div>
  );
}
