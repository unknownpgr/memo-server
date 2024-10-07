import { Observable } from "./observable";

export type AuthState = "authorized" | "verifying" | "unauthorized";
export type AuthEvent = "StateChange";

export interface AuthRepository {
  login(request: { requestBody: { password: string } }): Promise<string>;
  logout(request: { authorization: string }): Promise<void>;
  verifyToken(request: { authorization: string }): Promise<boolean>;
}

export interface AuthService extends Observable<AuthEvent> {
  login(password: string): Promise<void>;
  logout(): Promise<void>;
  getAuthState(): AuthState;
  getToken(): string;
}
