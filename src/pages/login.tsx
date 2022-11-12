import React, { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");

  async function login() {
    await fetch("/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  }

  return (
    <div>
      Password :{" "}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />{" "}
      <button onClick={login}>login</button>
    </div>
  );
}
