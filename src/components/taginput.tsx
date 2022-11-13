import React, { useEffect, useState } from "react";
import Tag from "../components/tag";

import styles from "../styles/taginput.module.css";

function parseTagString(tagString: string) {
  return tagString
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length);
}

function normalizeTagString(tagString: string) {
  return parseTagString(tagString).join(", ");
}

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [tagString, setTagString] = useState("");

  useEffect(() => {
    if (normalizeTagString(tagString) !== tags.join(", "))
      setTagString(tags.join(", "));
  }, [tags, tagString]);

  function onTagStringChange(tagString: string) {
    setTagString(tagString);
    setTags(parseTagString(tagString));
  }

  return (
    <div className={styles.taginput}>
      <input
        className={styles.input}
        type="text"
        value={tagString}
        onChange={(e) => onTagStringChange(e.target.value)}
      />
      <span className={styles.label}>Tags:</span>
      {tags.map((tag) => (
        <Tag key={tag} value={tag}></Tag>
      ))}
    </div>
  );
}
