import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import { di } from "../di";

const MIN_PASSWORD_LENGTH = 8;

export default function Login() {
  const service = useObservable(di.service);
  const [username, setUsername] = useState("");
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

  async function signUp() {
    if (username.length === 0 || password.length === 0) {
      log(
        `To sign up, please enter both username and password, and click sign up button.`
      );
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      log(
        `Password is too short. It must be at least ${MIN_PASSWORD_LENGTH} characters long`
      );
      return;
    }

    try {
      await service.register(username, password);
      setUsername("");
      setPassword("");
      log(`Successfully signed up. Login with your username and password.`);
    } catch {
      log(`Failed to sign up.`);
    }
  }

  async function signIn() {
    try {
      await service.login(username, password);
      navigate("/");
    } catch {
      log(`Username or password is invalid.`);
    }
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
      <h1>Memo</h1>
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
      <button onClick={signUp} disabled={isLoading}>
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
