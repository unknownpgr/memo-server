import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useJSON from "../hooks/useJSON";
import { MemoWithTags } from "../types";
import styles from "../styles/index.module.css";
import Tags from "../components/tags";

export default function Home() {
  const { data, isValidating, mutate } = useJSON<MemoWithTags[]>("/api/memo");
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  async function onCreateMemo() {
    await fetch("/api/memo/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, tags }),
    });
    setTags([]);
    setContent("");
    mutate();
  }

  return (
    <div>
      <Head>
        <title>Memo</title>
        <meta name="description" content="Memo server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Memo</h1>
      <textarea
        className={styles.content}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <h2>Tags</h2>
      <Tags tags={tags} setTags={setTags}></Tags>
      <button onClick={onCreateMemo}>Create Memo</button>
      <hr />
      {data ? (
        <ol>
          {data.map((data) => (
            <li key={data.id}>
              <div>
                <Link href={`/memo/${data.id}`}>
                  {data.content || "NO CONTENT"}
                </Link>
              </div>
              <div>
                {data.tags.map((tag) => (
                  <span key={tag.id}>[{tag.value}]</span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <strong>No data exists</strong>
      )}
    </div>
  );
}
