import { useEffect, useState } from "react";
import { MdCreate, MdList, MdLogout } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import MemoList from "../components/memolist";
import { di } from "../di";
import MemoView from "./memo";

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
    <div className="h-dvh flex flex-col">
      <div className="py-2 px-4 border-b flex justify-between">
        <button className="py-2 px-4" onClick={() => setShowList(!showList)}>
          <MdList />
        </button>
        <button className="py-2 px-4" onClick={signOut}>
          <MdLogout />
        </button>
      </div>
      <div className="flex h-0 flex-1">
        <div
          className="w-full h-full p-8 fixed bg-white z-10 overflow-scroll lg:w-96 lg:static"
          hidden={!showList}>
          <MemoList />
          <button className="font-bold" onClick={createMemo}>
            <MdCreate />
          </button>
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
