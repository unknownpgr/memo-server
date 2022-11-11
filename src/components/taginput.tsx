import React, { KeyboardEvent, useState } from "react";

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
    <div>
      <input
        type="text"
        value={currentTag}
        onChange={(e) => setCurrentTag(e.target.value)}
        onKeyDown={onKeyDown}
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
