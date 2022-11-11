import { useRouter } from "next/router";
import React from "react";
import MemoList from "../../components/memolist";
import useJSON from "../../hooks/useJSON";
import { MemoWithTags } from "../../types";

export default function Tag() {
  const router = useRouter();
  const { tag } = router.query;

  const { data, error } = useJSON<MemoWithTags[]>(`/api/memo?tag=${tag}`);

  if (error) return <h1>Error</h1>;
  if (!data) return <h1>Loading</h1>;
  return (
    <div>
      <h1>{tag}</h1>
      <MemoList memos={data} />
    </div>
  );
}
