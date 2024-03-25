import { Link, useParams } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import { MemoNode } from "../core/service";
import { di } from "../di";

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
  const service = useObservable(di.service);
  const memoTree = service.getMemoTree();
  return (
    <div className="mb-8">
      {memoTree.children.map((c) => (
        <MemoItem key={c.id} {...c} />
      ))}
    </div>
  );
}
