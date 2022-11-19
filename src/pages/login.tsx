import React, { useState } from "react";

import { useRouter } from "next/router";
import { onSignUp, onSignIn } from "./login.telefunc";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const router = useRouter();

  function log(message: string) {
    setLogs((logs) => [message, ...logs]);
  }

  async function signUp() {
    setIsLoading(true);
    const user = await onSignUp(username, password);
    if (user) {
      log(`User ${user.username}(#${user.id}) registered.`);
    } else {
      log(`Failed to create user.`);
    }
    setIsLoading(false);
  }

  async function signIn() {
    setIsLoading(true);
    const user = await onSignIn(username, password);
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
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      <br />
      <br />
      <button onClick={signIn} disabled={isLoading}>
        [ Sign In ]
      </button>{" "}
      <button onClick={signUp} disabled={isLoading}>
        [ Sign Up ]
      </button>
      <div>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
