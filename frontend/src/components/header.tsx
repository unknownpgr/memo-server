import { useNavigate } from "react-router-dom";
import { MemoService } from "../service";
import styles from "./header.module.css";

export function Header({ service }: { service: MemoService }) {
  const navigate = useNavigate();
  const isLoggedIn = service.isLoggedIn();

  async function signOut() {
    await service.logout();
    navigate("/login");
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Memo</h1>
        {isLoggedIn && (
          <button className={styles.button} onClick={signOut}>
            Sign out
          </button>
        )}
      </header>
    </>
  );
}
