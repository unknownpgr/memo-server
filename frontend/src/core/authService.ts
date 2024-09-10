import {
  AuthEvent,
  AuthRepository,
  AuthService,
  AuthState,
} from "./model/auth";
import { Observable } from "./model/observable";

export class AuthServiceImpl
  extends Observable<AuthEvent>
  implements AuthService
{
  private token: string = "";
  private authState: AuthState = "verifying";

  constructor(private readonly repo: AuthRepository) {
    super();
    this.verifyToken();
  }

  private async verifyToken(): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      this.authState = "unauthorized";
      this.notify("StateChange");
      return;
    }

    try {
      this.token = token;
      this.authState = "authorized";
      this.notify("StateChange");
    } catch (e) {
      this.authState = "unauthorized";
      this.notify("StateChange");
    }
  }

  public async login(password: string): Promise<void> {
    if (this.authState === "authorized") return;
    if (this.authState === "verifying") return;

    this.authState = "verifying";
    this.notify("StateChange");
    try {
      const token = await this.repo.login({
        requestBody: { password },
      });
      localStorage.setItem("token", token);
      this.token = token;
      this.authState = "authorized";
      this.notify("StateChange");
    } catch (e) {
      this.authState = "unauthorized";
      this.notify("StateChange");
    }
  }

  public async logout(): Promise<void> {
    localStorage.removeItem("token");
    this.token = "";
    this.authState = "unauthorized";
    this.notify("StateChange");
  }

  public getAuthState(): AuthState {
    return this.authState;
  }

  public getToken(): string {
    return this.token;
  }
}
