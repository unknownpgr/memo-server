import React, { KeyboardEvent, useState } from "react";

import styles from "../styles/taginput.module.css";

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [currentTag, setCurrentTag] = useState("");

  function onAddTag() {
    setCurrentTag("");
    if (tags.indexOf(currentTag) >= 0) return;
    setTags((tags) => [...tags, currentTag]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter") onAddTag();
  }

  function onRemoveTag(tag: string) {
    setTags((tags) => tags.filter((value) => value !== tag));
  }

  return (
    <div className={styles.taginput}>
      <h2>
        Tags{" "}
        <button disabled={!currentTag} onClick={onAddTag}>
          [ Add tag ]
        </button>
      </h2>
      <input
        className={styles.input}
        type="text"
        value={currentTag}
        onChange={(e) => setCurrentTag(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <ul>
        {tags.map((tag) => (
          <li key={tag}>
            {tag} <button onClick={() => onRemoveTag(tag)}>[ X ]</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
