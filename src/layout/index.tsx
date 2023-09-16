import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import styles from "./layout.module.css";
import { onSignOut } from "../telefunc/login.telefunc";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isLogin = router.pathname === "/login";

  async function signOut() {
    await onSignOut();
    router.push("/login");
  }

  return (
    <div className={styles.container}>
      {!isLogin && (
        <>
          <header className={styles.header}>
            <h1 className={styles.title}>Memo</h1>
            <Link className={styles.button} href="/">
              Home
            </Link>
            <button className={styles.button} onClick={signOut}>
              Sign out
            </button>
          </header>
          <br />
        </>
      )}
      {children}
    </div>
  );
}
