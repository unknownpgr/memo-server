import Link from "next/link";
import React from "react";

export default function tag({ value }: { value: string }) {
  return (
    <Link href={`/tag/${value}`}>
      <span>[{value}]</span>
    </Link>
  );
}
