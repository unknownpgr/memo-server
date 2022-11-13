import Link from "next/link";
import React from "react";
import styles from "../styles/tag.module.css";

export default function tag({ value }: { value: string }) {
  return (
    <Link className={styles.tag} href={`/tag/${value}`}>
      <span>@{value}</span>
    </Link>
  );
}
