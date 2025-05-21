import { DefaultService } from "../api";
import { AuthRepository } from "../core/model/auth";
import { timeout } from "./timeout";

export class AuthRepositoryImpl implements AuthRepository {
  private api = DefaultService;

  async login(request: { requestBody: { password: string } }): Promise<string> {
    return await timeout(this.api.login(request));
  }

  async logout(request: { authorization: string }): Promise<void> {
    return await timeout(this.api.logout(request));
  }

  async verifyToken(request: { authorization: string }): Promise<boolean> {
    try {
      await timeout(this.api.listMemo(request));
      return true;
    } catch (e) {
      return false;
    }
  }
}
