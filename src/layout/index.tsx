import React, { ReactNode } from "react";

import Link from "next/link";
import styles from "../styles/layout.module.css";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "" }),
    });
    router.push("/");
  }

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/">[ Home ]</Link>
        <button onClick={logout}>[ Logout ]</button>
      </nav>
      <main className={styles.frame}>{children}</main>
    </>
  );
}
