import React, { ReactNode } from "react";
import styles from "../styles/layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className={styles.frame}>{children}</main>
    </>
  );
}
