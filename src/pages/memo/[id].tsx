import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Tags from "../../components/tags";
import useJSON from "../../hooks/useJSON";
import { MemoWithTags } from "../../types";

export default function View() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isValidating, mutate } = useJSON<MemoWithTags>(
    `/api/memo/${id}`
  );

  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  useEffect(() => {
    if (!data || isValidating) return;
    setContent(data.content);
    setTags(data.tags.map((tag) => tag.value));
  }, [data, isValidating]);

  async function updateMemo() {
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
      <div>
        <Link href="/">←</Link>
      </div>
      <h1>Memo #{id}</h1>
      <textarea
        disabled={isValidating}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div>
        <button onClick={updateMemo}>update</button>
      </div>
      <h2>Tags</h2>
      <Tags tags={tags} setTags={setTags}></Tags>
    </div>
  );
}
