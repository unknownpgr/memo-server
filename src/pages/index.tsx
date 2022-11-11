import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useJSON from "../hooks/useJSON";
import { MemoWithTags } from "../types";

async function createMemo() {
  const res = await fetch("/api/memo/create");
  return await res.json();
}

export default function Home() {
  const { data, isValidating } = useJSON<MemoWithTags[]>("/api/memo");
  const router = useRouter();

  async function onCreateMemo() {
    const id = await createMemo();
    router.push(`/memo/${id}`);
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Memo server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={onCreateMemo}>Create Memo</button>
      {isValidating ? (
        <strong>Loading...</strong>
      ) : data ? (
        <ol>
          {data.map((data) => (
            <li key={data.id}>
              <div>
                {" "}
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
