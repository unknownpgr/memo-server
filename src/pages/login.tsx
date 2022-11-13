import React, { useState } from "react";

import { useRouter } from "next/router";
import { post } from "../api";

export default function Login() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function login() {
    const response = await post("/api/login", { password });
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
