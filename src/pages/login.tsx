import React, { useState } from "react";

import { useRouter } from "next/router";
import { onAddUser, onLogin } from "./login.telefunc";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const router = useRouter();

  function log(message: string) {
    setLogs((logs) => [message, ...logs]);
  }

  async function signIn() {
    setIsLoading(true);
    const user = await onAddUser(username, password);
    if (user) {
      log(`User ${user.username}(#${user.id}) registered.`);
    } else {
      log(`Failed to create user.`);
    }
    setIsLoading(false);
  }

  async function login() {
    setIsLoading(true);
    const user = await onLogin(username, password);
    if (user) router.push("/");
    else {
      log(`Username or password is invalid.`);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>[ login ]</button>
      <button onClick={signIn}>[ sign in ]</button>
      <div>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
