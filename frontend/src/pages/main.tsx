import { useEffect, useState } from "react";
import { MdCreate, MdList, MdSettings } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import { MemoList } from "../components/memolist";
import { di } from "../di";
import { MemoView } from "./memo";

function useMemoId() {
  const { id } = useParams();
  if (!id) return -1;
  return parseInt(id);
}

export function Home() {
  const navigate = useNavigate();
  const memoId = useMemoId();
  const [showList, setShowList] = useState(false);
  const memo = useObservable(di.memoService);
  const state = memo.getMemoState();

  // Load memo if memoId is provided or changed
  useEffect(() => {
    if (memoId < 0) return;
    memo.loadMemo(memoId);
  }, [memo, memoId]);

  // If memoId is not provided, go to the first memo or create a new memo if there is no memo
  useEffect(() => {
    if (memoId >= 0) return;
    if (state !== "idle") return;
    const tree = memo.getMemoTree();
    if (tree.children.length === 0) return;
    navigate(`/memo/${tree.children[0].id}`);
  }, [memo, state, memoId, navigate]);

  // If memo is changed, hide the list
  useEffect(() => {
    if (memoId >= 0) {
      setShowList(false);
    }
  }, [memoId]);

  const createMemo = async () => {
    const newMemo = await memo.createMemo();
    navigate(`/memo/${newMemo.id}`);
  };

  return (
    <div className="h-dvh flex flex-col">
      <div className="py-2 px-6 border-b flex">
        <button className="p-2" onClick={() => setShowList(!showList)}>
          <MdList />
        </button>
        <button className="p-2" onClick={createMemo}>
          <MdCreate />
        </button>
        <div className="flex-1" />
        <Link className="p-2" to="/settings">
          <MdSettings />
        </Link>
      </div>
      <div className="flex h-0 flex-1">
        <div
          className="w-full h-full p-8 fixed bg-white z-10 overflow-scroll lg:w-96 lg:static"
          hidden={!showList}>
          <MemoList />
        </div>
        <div className="ml-0 w-0 h-full overflow-scroll flex flex-col flex-1 p-8">
          <div className="w-full flex-1">
            {memoId >= 0 && <MemoView memoId={memoId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
