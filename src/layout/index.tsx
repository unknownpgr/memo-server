import { ReactNode } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/layout.module.css";
import { onSignOut } from "../telefunc/login.telefunc";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isLogin = router.pathname === "/login";

  async function signOut() {
    await onSignOut();
    router.push("/login");
  }

  return (
    <>
      <nav className={styles.nav}>
        {isLogin ? <span></span> : <Link href="/">[ Home ]</Link>}
        {isLogin ? (
          <span></span>
        ) : (
          <button onClick={signOut}>[ Sign Out ]</button>
        )}
      </nav>
      <main className={styles.frame}>{children}</main>
    </>
  );
}
