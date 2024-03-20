import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MemoList from "../components/memolist";
import { memoService } from "../service";
import MemoView from "./memo";

function useMemoId() {
  const { id } = useParams();
  if (!id) return -1;
  return parseInt(id);
}

const service = memoService;

export default function Home() {
  const navigate = useNavigate();
  const memoId = useMemoId();
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    if (!service.isLoggedIn()) {
      navigate("/login");
      console.log(service.isLoggedIn());
    }
  }, [navigate]);

  useEffect(() => {
    if (memoId >= 0) return;
    (async () => {
      const tree = await service.getMemoTree();
      if (tree.children.length > 0) {
        navigate(`/memo/${tree.children[0].id}`);
      } else {
        const newMemo = await service.createMemo();
        navigate(`/memo/${newMemo.id}`);
      }
    })();
  }, [memoId, navigate]);

  const createMemo = useCallback(async () => {
    const newMemo = await service.createMemo();
    navigate(`/memo/${newMemo.id}`);
  }, [navigate]);

  async function signOut() {
    await service.logout();
    navigate("/login");
  }

  return (
    <div className="h-dvh">
      <div
        className="w-full h-full p-8 border-r fixed bg-white z-10 lg:w-96 overflow-scroll"
        hidden={!showList}
      >
        <div className="flex flex-row mb-8">
          <button
            className="border border-gray-400 w-0 flex-1 p-2 rounded-md text-sm font-bold lg:hidden mr-2"
            onClick={() => setShowList(!showList)}
          >
            Hide List
          </button>
          <button
            className="border border-gray-400 w-0 flex-1 p-2 rounded-md text-sm font-bold mr-2"
            onClick={signOut}
          >
            Sign out
          </button>
          <button
            className="border border-gray-400 w-0 flex-1 p-2 rounded-md text-sm font-bold"
            onClick={createMemo}
          >
            New Memo
          </button>
        </div>
        <MemoList />
      </div>
      <div className="ml-0 h-full overflow-scroll flex flex-col items-center p-8 lg:ml-96">
        <button
          className="border border-gray-400 w-full p-2 rounded-md text-sm font-bold lg:hidden"
          onClick={() => setShowList(!showList)}
          hidden={showList}
        >
          Show List
        </button>
        <div className="max-w-4xl w-full">
          {memoId === -1 ? (
            <div>Select a memo</div>
          ) : (
            <MemoView memoId={memoId} />
          )}
        </div>
      </div>
    </div>
  );
}
