import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Tags from "../../components/taginput";
import useJSON from "../../hooks/useJSON";
import { MemoWithTags } from "../../types";
import memoStyles from "../../styles/memo.module.css";

export default function View() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isValidating, mutate } = useJSON<MemoWithTags>(
    `/api/memo/${id}`
  );

  const [isChanged, setIsChanged] = useState(false);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (!data || isValidating) return;
    setContent(data.content);
    setTags(data.tags.map((tag) => tag.value));
  }, [data, isValidating]);

  async function updateMemo() {
    setIsChanged(false);
    await fetch(`/api/memo/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        tags,
      }),
    });
    mutate();
  }

  if (error) return <div>Error : {`${error}`}</div>;
  return (
    <div>
      <h1>
        Memo #{id}{" "}
        <button onClick={updateMemo} disabled={!isChanged || isValidating}>
          update
        </button>
      </h1>
      <textarea
        className={memoStyles.content}
        disabled={isValidating}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsChanged(true);
        }}
      ></textarea>
      <h2>Tags</h2>
      <Tags
        tags={tags}
        setTags={(v) => {
          setTags(v);
          setIsChanged(true);
        }}
      ></Tags>
    </div>
  );
}
