import React, { KeyboardEvent, useState } from "react";

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
      <ul>
        {tags
          .filter((x) => x.trim().length)
          .map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
      </ul>
    </div>
  );
}
