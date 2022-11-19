import React, { ReactNode } from "react";

import Link from "next/link";
import styles from "../styles/layout.module.css";
import { useRouter } from "next/router";
import { onLogout } from "../pages/login.telefunc";
import { InferGetServerSidePropsType } from "next";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHome = router.pathname === "/";

  async function logout() {
    await onLogout();
    router.push("/login");
  }

  return (
    <>
      <nav className={styles.nav}>
        {isHome ? <span></span> : <Link href="/">[ Home ]</Link>}
        <button onClick={logout}>[ Logout ]</button>
      </nav>
      <main className={styles.frame}>{children}</main>
    </>
  );
}
