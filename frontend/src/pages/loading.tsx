import { useState } from "react";

export function Loading() {
  const [dots, setDots] = useState(0);
  setTimeout(() => {
    setDots((dots + 1) % 4);
  }, 500);

  const dotString = ".".repeat(dots);

  return (
    <div className="container mx-auto h-dvh p-2 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">Loading{dotString}</h1>
    </div>
  );
}
