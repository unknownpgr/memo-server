import { Memo, Tag } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

  const [currentTag, setCurrentTag] = useState("");

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

  function onAddTag() {
    setCurrentTag("");
    if (tags.indexOf(currentTag) >= 0) return;
    setTags((tags) => [...tags, currentTag]);
  }

  function onRemoveTag(tag: string) {
    setTags((tags) => tags.filter((value) => value !== tag));
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
      <input
        type="text"
        value={currentTag}
        onChange={(e) => setCurrentTag(e.target.value)}
      />
      <button disabled={!currentTag} onClick={onAddTag}>
        Add tag
      </button>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>
            {tag} <button onClick={() => onRemoveTag(tag)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
