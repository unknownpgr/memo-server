import { KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import { di } from "../di";

function isPasswordValid(password: string) {
  return password.length > 8;
}

export function Login() {
  const service = useObservable(di.authService);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = service.getAuthState() === "authorized";
  const isLoading = service.getAuthState() === "verifying";

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  async function signIn() {
    try {
      await service.login(password);
      navigate("/");
    } catch {
      setPassword("");
    }
  }

  function onPasswordKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") signIn();
  }

  return (
    <div className="container mx-auto h-dvh p-2 flex flex-col justify-center items-center">
      <input
        className="py-2 outline-none text-center"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={onPasswordKeyDown}
        disabled={isLoading}
      />
      <button
        className="mt-4 disabled:opacity-50"
        onClick={signIn}
        disabled={isLoading || !isPasswordValid(password)}>
        Sign In
      </button>
    </div>
  );
}
