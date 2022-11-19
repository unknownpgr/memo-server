import React, { KeyboardEvent, useRef, useState } from "react";

import { useRouter } from "next/router";
import { onSignUp, onSignIn } from "./login.telefunc";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function log(message: string) {
    setLogs((logs) => [`#${logs.length + 1}. ${message}`, ...logs]);
  }

  async function signUp() {
    setIsLoading(true);
    const user = await onSignUp(username, password);
    if (user) {
      log(`User ${user.username} signed up.`);
    } else {
      log(`Failed to sign up.`);
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

  const isUserValid = username.length > 0 && password.length > 0;

  function onUsernameKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && passwordRef.current) passwordRef.current.focus();
  }

  function onPasswordKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && isUserValid) signIn();
  }

  return (
    <div>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={onUsernameKeyDown}
        disabled={isLoading}
        autoFocus
      />
      <br />
      <br />
      <input
        ref={passwordRef}
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={onPasswordKeyDown}
        disabled={isLoading}
      />
      <br />
      <br />
      <button onClick={signIn} disabled={isLoading || !isUserValid}>
        [ Sign In ]
      </button>{" "}
      <button onClick={signUp} disabled={isLoading || !isUserValid}>
        [ Sign Up ]
      </button>
      <br />
      <br />
      <div>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
