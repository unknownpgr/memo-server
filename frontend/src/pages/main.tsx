import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MemoSummary } from "../api";
import MemoList from "../components/memolist";
import { memoService } from "../service";
import styles from "./main.module.css";
import MemoView from "./memo";

function useMemoId() {
  const { id } = useParams();
  if (!id) return -1;
  return parseInt(id);
}

function isHttpResponseError(
  error: unknown
): error is { response: { status: number } } {
  if (typeof error !== "object" || error === null) return false;
  const response = (error as { response: unknown }).response;
  if (typeof response !== "object" || response === null) return false;
  const status = (response as { status: unknown }).status;
  if (typeof status !== "number") return false;
  return true;
}

const service = memoService;

export default function Home() {
  const [memos, setMemos] = useState<MemoSummary[]>([]);
  const navigate = useNavigate();
  const memoId = useMemoId();
  const [showList, setShowList] = useState(true);

  const refresh = useCallback(async () => {
    if (!service.isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const res = await service.listMemo();
      setMemos(res);
    } catch (error: unknown) {
      if (isHttpResponseError(error) && error.response.status === 401) {
        navigate("/login");
      } else {
        alert("Unexpected error occurred");
        console.error(error);
      }
    }
  }, [navigate]);

  const createMemo = useCallback(async () => {
    const newMemo = await service.createMemo();
    navigate(`/memo/${newMemo.id}`);
  }, [navigate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function signOut() {
    await service.logout();
    navigate("/login");
  }

  if (!memos) return <h1>Loading</h1>;

  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        <div
          className={styles.columnList + " " + (!showList && styles.hideList)}>
          <button
            className={styles.button + " " + styles.signOutButton}
            onClick={signOut}>
            Sign out
          </button>
          <button
            className={styles.button + " " + styles.newMemoButton}
            onClick={createMemo}>
            + New Memo
          </button>
          <MemoList memos={memos} />
        </div>
        <div className={styles.divider} />
        <div className={styles.columnView}>
          {memoId === -1 ? (
            <div>Select a memo</div>
          ) : (
            <MemoView memoId={memoId} />
          )}
        </div>
        <button
          className={
            styles.toggleListButton + " " + (!showList && styles.hideButton)
          }
          onClick={() => setShowList(!showList)}>
          &lt;
        </button>
      </div>
    </div>
  );
}
