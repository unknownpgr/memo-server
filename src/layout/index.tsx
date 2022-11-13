import React, { ReactNode } from "react";

import Link from "next/link";
import styles from "../styles/layout.module.css";
import { useRouter } from "next/router";
import { post } from "../api";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function logout() {
    await post("/api/login", { password: "" });
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
