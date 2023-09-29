import React, { useEffect, useState } from "react";
import styles from "./tagSelector.module.css";

function parseTagString(tagString: string) {
  return tagString
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length);
}

function normalizeTagString(tagString: string) {
  return parseTagString(tagString).join(", ");
}

export default function TagSelector({
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
        type="text"
        className={styles.input}
        value={tagString}
        placeholder="You can write tags here. Tags are comma-separted."
        onChange={(e) => onTagStringChange(e.target.value)}
        spellCheck="false"
      />
    </div>
  );
}
