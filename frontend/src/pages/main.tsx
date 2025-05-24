import { useEffect, useState } from "react";
import { MdCreate, MdHome, MdList, MdSettings } from "react-icons/md";
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
  const state = memo.getServiceState();
  const firstMemoId = memo.getFirstMemoId();

  useEffect(() => {
    // If something is loading, or not initialized, do nothing
    if (state !== "idle") return;

    // If memoId is specified, load the memo
    if (memoId >= 0) {
      memo.loadMemo(memoId);
      return;
    }

    // If memoId is not specified, load the first memo
    if (firstMemoId < 0) return;
    navigate(`/memo/${firstMemoId}`);
  }, [memo, memoId, state, firstMemoId, navigate]);

  const createMemo = async () => {
    const newMemo = await memo.createMemo();
    navigate(`/memo/${newMemo.id}`);
  };

  return (
    <div className="h-dvh flex flex-col">
      <div className="py-2 px-8 border-b flex">
        <button className="p-2" onClick={() => setShowList(!showList)}>
          <MdList />
        </button>
        <button className="p-2" onClick={createMemo}>
          <MdCreate />
        </button>
        {firstMemoId >= 0 && (
          <Link className="p-2" to={`/memo/${firstMemoId}`}>
            <MdHome />
          </Link>
        )}
        <div className="flex-1" />
        <Link className="p-2" to="/settings">
          <MdSettings />
        </Link>
      </div>
      <div className="flex h-0 flex-1">
        <div
          className="w-full h-full py-8 pl-8 fixed bg-white z-10 overflow-x-hidden overflow-y-scroll lg:w-64 lg:static"
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
