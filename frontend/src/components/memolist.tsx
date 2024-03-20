import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MemoNode, memoService } from "../service";

const service = memoService;

function MemoItem({ id, title, children }: MemoNode) {
  const { id: currentMemo } = useParams();
  const isSelected = `${id}` === currentMemo;

  return (
    <div className="">
      <Link className="" to={`/memo/${id}`}>
        {isSelected ? <strong>{title}</strong> : title}
      </Link>
      <div className="pl-8 my-4">
        {children.map((c) => (
          <MemoItem key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}

export default function MemoList() {
  const [memoTree, setMemoTree] = useState<MemoNode>({
    id: 0,
    title: "",
    children: [],
  });

  useEffect(() => {
    async function refresh() {
      const memoTree = await service.getMemoTree();
      setMemoTree(memoTree);
    }
    refresh();
  }, []);

  return (
    <div className="mb-8">
      {memoTree.children.map((c) => (
        <MemoItem key={c.id} {...c} />
      ))}
    </div>
  );
}
