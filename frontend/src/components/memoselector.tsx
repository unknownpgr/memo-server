import { useEffect, useState } from "react";
import { memoService } from "../service";
import { MemoSummary } from "../api";

const service = memoService;

export function MemoSelector({ onSelect }: { onSelect: (id: number) => void }) {
  const [memoList, setMemoList] = useState<MemoSummary[]>([]);

  useEffect(() => {
    async function refresh() {
      let res = await service.listMemo();
      res = res.sort((a, b) => {
        if (a.title < b.title) return -1;
        else if (a.title > b.title) return 1;
        else return 0;
      });
      setMemoList(res);
    }
    refresh();
  }, []);

  return (
    <div>
      <h1>Search Memo</h1>
      <ul>
        <li>
          <button onClick={() => onSelect(0)}>ROOT</button>
        </li>
        {memoList.map((memo) => (
          <li key={memo.id}>
            <button onClick={() => onSelect(memo.id)}>{memo.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
