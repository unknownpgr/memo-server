import React, { useState } from "react";
import Tag from "../components/tag";

import styles from "../styles/taginput.module.css";

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [currentTags, setCurrentTags] = useState(tags.join(", "));

  function onTagStringChange(tagString: string) {
    setCurrentTags(tagString);
    setTags(tagString.split(",").map((x) => x.trim()));
  }

  return (
    <div className={styles.taginput}>
      <h2>Tags</h2>
      <input
        className={styles.input}
        type="text"
        value={currentTags}
        onChange={(e) => onTagStringChange(e.target.value)}
      />
      {tags
        .filter((tag) => tag.length)
        .map((tag) => (
          <Tag key={tag} value={tag}></Tag>
        ))}
    </div>
  );
}
