import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MemoList from "../components/memolist";
import { memoService } from "../service";
import styles from "./main.module.css";
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

  const createMemo = useCallback(async () => {
    const newMemo = await service.createMemo();
    navigate(`/memo/${newMemo.id}`);
  }, [navigate]);

  async function signOut() {
    await service.logout();
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        <div
          className={styles.columnList + " " + (!showList && styles.hideList)}
        >
          <button
            className={styles.button + " " + styles.signOutButton}
            onClick={signOut}
          >
            Sign out
          </button>
          <button
            className={styles.button + " " + styles.newMemoButton}
            onClick={createMemo}
          >
            + New Memo
          </button>
          <MemoList />
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
          onClick={() => setShowList(!showList)}
        >
          &lt;
        </button>
      </div>
    </div>
  );
}
