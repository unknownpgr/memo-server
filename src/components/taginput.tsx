import React, { useEffect, useState } from "react";
import Tag from "../components/tag";

import styles from "../styles/taginput.module.css";

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [tagString, setTagString] = useState("");

  useEffect(() => {
    if (
      tagString
        .split(",")
        .map((x) => x.trim())
        .join(", ") !== tags.join(", ")
    )
      setTagString(tags.join(", "));
  }, [tags, tagString]);

  function onTagStringChange(tagString: string) {
    setTagString(tagString);
    setTags(tagString.split(",").map((x) => x.trim()));
  }

  return (
    <div className={styles.taginput}>
      <h2>Tags</h2>
      <input
        className={styles.input}
        type="text"
        value={tagString}
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
