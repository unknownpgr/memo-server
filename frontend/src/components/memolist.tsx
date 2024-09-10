import { Link, useParams } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import { MemoNode } from "../core/service";
import { di } from "../di";

function MemoItem(node: MemoNode) {
  const { id: currentMemo } = useParams();
  const { id, children } = node;
  const title = node.title || "Untitled";
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

export function MemoList() {
  const service = useObservable(di.memoService);
  const memoTree = service.getMemoTree();
  return (
    <div>
      {memoTree.children.map((c) => (
        <MemoItem key={c.id} {...c} />
      ))}
    </div>
  );
}
