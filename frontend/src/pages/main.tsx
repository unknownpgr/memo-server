import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemoSummary } from "../api";
import { Header } from "../components/header";
import { MemoService } from "../service";
import styles from "./main.module.css";
import MemoList from "../components/memolist";

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

export default function Home({ service }: { service: MemoService }) {
  const [memos, setMemos] = useState<MemoSummary[]>([]);
  const navigate = useNavigate();

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
  }, [navigate, service]);

  const createMemo = useCallback(async () => {
    const newMemo = await service.createMemo();
    navigate(`/memo/${newMemo.id}`);
  }, [service, navigate]);

  const deleteMemo = useCallback(
    async (number: number) => {
      if (!confirm(`Do you really want to delete memo ${number}?`)) return;
      await service.deleteMemo(number);
      refresh();
    },
    [service, refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!memos) return <h1>Loading</h1>;

  return (
    <div className={styles.container}>
      <Header service={service} />
      <div>
        <button onClick={createMemo}>Create new memo</button>
      </div>
      <br />
      <MemoList memos={memos} onDeleteMemo={deleteMemo} />
      <footer className={styles.footer}>© 2023 Copyright : UnknownPgr</footer>
    </div>
  );
}
