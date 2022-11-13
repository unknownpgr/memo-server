import Link from "next/link";
import React from "react";
import styles from "../styles/tag.module.css";

export default function tag({
  value,
  onClick,
  disabled = false,
}: {
  value: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const className = styles.tag + (disabled ? " " + styles.disabled : "");

  if (onClick)
    return (
      <span className={className} onClick={onClick}>
        <span>@{value}</span>
      </span>
    );
  else
    return (
      <Link className={className} href={`/tag/${value}`}>
        <span>@{value}</span>
      </Link>
    );
}
