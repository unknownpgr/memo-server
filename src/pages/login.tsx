import React, { useState } from "react";

import { useRouter } from "next/router";

export default function Login() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function login() {
    const response = await fetch("/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.status === 200) router.push("/");
    else setPassword("");
  }

  return (
    <div>
      Password :{" "}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />{" "}
      <button onClick={login}>[ login ]</button>
    </div>
  );
}