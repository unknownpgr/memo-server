import { KeyboardEvent, useState } from "react";
import { useObservable } from "../adapter/useObservable";
import { di } from "../di";

function isPasswordValid(password: string) {
  return password.length >= 8;
}

export function Login() {
  const auth = useObservable(di.authService);
  const [password, setPassword] = useState("");

  async function signIn() {
    if (!isPasswordValid(password)) return;
    await auth.login(password);
    if (auth.getAuthState() === "unauthorized") setPassword("");
  }

  function onPasswordKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") signIn();
  }

  return (
    <div className="container mx-auto max-w-64 h-dvh p-2 flex flex-col justify-center">
      <input
        className="py-1 mb-4 outline-none text-center font-bold bg-white border border-gray-300 rounded-md"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={onPasswordKeyDown}
      />
      {isPasswordValid(password) ? (
        <button
          className="py-1 outline-none text-center bg-black text-white font-bold rounded-md"
          onClick={signIn}>
          Sign In
        </button>
      ) : (
        <span className="py-1">&nbsp;</span>
      )}
    </div>
  );
}
