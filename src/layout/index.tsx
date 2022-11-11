import Link from "next/link";
import React, { ReactNode } from "react";
import styles from "../styles/layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav style={{ textAlign: "center" }}>
        <Link href="/">[Memo]</Link>
      </nav>
      <main className={styles.frame}>{children}</main>
    </>
  );
}
