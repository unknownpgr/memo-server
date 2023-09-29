import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Tags from "../components/tagSelector";
import { MemoService } from "../service";
import styles from "./memo.module.css";

function useMemoId() {
  const { id } = useParams();
  if (!id) return -1;
  return parseInt(id);
}

function hash(content: string, tags: string[]) {
  return content + tags.join(",");
}

export default function Memo({ service }: { service: MemoService }) {
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const debouncingRef = useRef<number | null>(null);
  const cache = useRef<string | null>(null);
  const number = useMemoId();

  useEffect(() => {
    if (number < 0) return;
    async function loadMemo() {
      const memo = await service.findMemo(number);
      setContent(memo.content);
      setTags(memo.tags);
      cache.current = hash(memo.content, memo.tags);
    }
    loadMemo();
  }, [service, number]);

  useEffect(() => {
    const key = hash(content, tags);
    if (number < 0) return;
    if (cache.current === null) return;
    if (cache.current === key) return;
    cache.current = key;
    setIsSaving(true);
    const timeout = setTimeout(async () => {
      if (debouncingRef.current !== timeout) return;
      await service.updateMemo(number, content, tags);
      setIsSaving(false);
    }, 1000);
    debouncingRef.current = timeout;
  }, [service, number, content, tags]);

  return (
    <div className={styles.container}>
      <header>
        <h2>
          # {number}
          {isSaving ? "*" : ""}
        </h2>
        <Link to="/">Home</Link>
      </header>
      <textarea
        className={styles.content}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <Tags tags={tags} setTags={(v) => setTags(v)}></Tags>
    </div>
  );
}
