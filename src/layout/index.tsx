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
      <div className={styles.frame}>
        {!isLogin && (
          <>
            You can go <Link href="/">{"'home'"}</Link> or{" "}
            <button onClick={signOut}>{"'sign out.'"}</button>
          </>
        )}
        {children}
      </div>
    </>
  );
}
