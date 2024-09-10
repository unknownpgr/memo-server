import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import { di } from "../di";

export default function Login() {
  const service = useObservable(di.service);
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isLoggedIn = service.getAuthState() === "authorized";
  const isLoading = service.getAuthState() === "verifying";

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  function log(message: string) {
    setLogs((logs) => [`#${logs.length + 1}. ${message}`, ...logs]);
  }

  async function signIn() {
    try {
      await service.login(password);
      navigate("/");
    } catch {
      log(`Username or password is invalid.`);
    }
  }

  function onPasswordKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") signIn();
  }

  return (
    <div className="container mx-auto h-dvh p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl">Memo</h1>
      <input
        ref={passwordRef}
        className="py-2 outline-none text-center"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={onPasswordKeyDown}
        disabled={isLoading}
      />
      <button onClick={signIn} disabled={isLoading}>
        Sign In
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
