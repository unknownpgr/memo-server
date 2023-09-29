import { KeyboardEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemoService } from "../service";

const MIN_PASSWORD_LENGTH = 8;

export default function Login({ service }: { service: MemoService }) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

    setIsLoading(true);
    try {
      await service.register(username, password);
      setUsername("");
      setPassword("");
      log(`Successfully signed up. Login with your username and password.`);
    } catch {
      log(`Failed to sign up.`);
    }
    setIsLoading(false);
  }

  async function signIn() {
    setIsLoading(true);
    try {
      await service.login(username, password);
      navigate("/");
    } catch {
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
