import React, { ReactNode } from "react";

import Link from "next/link";
import styles from "../styles/layout.module.css";
import { useRouter } from "next/router";
import { onSignOut } from "../telefunc/login.telefunc";
import { InferGetServerSidePropsType } from "next";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const isLogin = router.pathname === "/login";

  async function signOut() {
    await onSignOut();
    router.push("/login");
  }

  return (
    <>
      <nav className={styles.nav}>
        {isHome || isLogin ? <span></span> : <Link href="/">[ Home ]</Link>}
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
