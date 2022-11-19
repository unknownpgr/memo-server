import React from "react";
import styles from "../styles/tag.module.css";

export default function Tag({
  value,
  onClick,
  disabled = false,
}: {
  value: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const classes = [styles.tag];
  if (disabled) classes.push(styles.disabled);
  if (onClick) classes.push(styles.clickable);
  return (
    <span className={classes.join(" ")} onClick={onClick}>
      <span>@{value}</span>
    </span>
  );
}
