import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import MemoList from "../components/memolist";
import { di } from "../di";
import MemoView from "./memo";
import { MdLogout } from "react-icons/md";

function useMemoId() {
  const { id } = useParams();
  if (!id) return -1;
  return parseInt(id);
}

export default function Home() {
  const navigate = useNavigate();
  const memoId = useMemoId();
  const [showList, setShowList] = useState(true);
  const service = useObservable(di.service);
  const authState = service.getAuthState();

  useEffect(() => {
    if (authState === "unauthorized") {
      navigate("/login");
      return;
    }
  }, [authState, navigate]);

  useEffect(() => {
    if (memoId < 0) return;
    if (authState !== "authorized") return;
    service.loadMemo(memoId);
  }, [service, authState, memoId, navigate]);

  useEffect(() => {
    if (memoId >= 0) return;
    if (authState !== "authorized") return;
    (async () => {
      const tree = service.getMemoTree();
      if (tree.children.length > 0) {
        navigate(`/memo/${tree.children[0].id}`);
      } else {
        const newMemo = await service.createMemo();
        navigate(`/memo/${newMemo.id}`);
      }
    })();
  }, [service, authState, memoId, navigate]);

  const createMemo = async () => {
    const newMemo = await service.createMemo();
    navigate(`/memo/${newMemo.id}`);
  };

  async function signOut() {
    await service.logout();
    navigate("/login");
  }

  return (
    <div className="h-dvh">
      <div
        className="w-full h-full p-8 border-r fixed bg-white z-10 lg:w-96 overflow-scroll"
        hidden={!showList}>
        <div className="flex flex-row mb-8">
          <button
            className="border border-gray-400 p-2 rounded-md text-sm font-bold mr-2"
            onClick={signOut}>
            <MdLogout />
          </button>
          <button
            className="border border-gray-400 w-0 flex-1 p-2 rounded-md text-sm font-bold lg:hidden mr-2"
            onClick={() => setShowList(!showList)}>
            Hide List
          </button>
          <button
            className="border border-gray-400 w-0 flex-1 p-2 rounded-md text-sm font-bold"
            onClick={createMemo}>
            New Memo
          </button>
        </div>
        <MemoList />
      </div>
      <div className="ml-0 h-full overflow-scroll flex flex-col items-center p-8 lg:ml-96">
        <button
          className="border border-gray-400 w-full p-2 rounded-md text-sm font-bold mb-4 lg:hidden"
          onClick={() => setShowList(!showList)}
          hidden={showList}>
          Show List
        </button>
        <div className="w-full flex-1">
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
