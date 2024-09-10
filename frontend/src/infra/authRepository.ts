import { DefaultService } from "../api";
import { AuthRepository } from "../core/model/auth";

export class AuthRepositoryImpl implements AuthRepository {
  private api = DefaultService;

  async login(request: { requestBody: { password: string } }): Promise<string> {
    return await this.api.login(request);
  }

  async logout(request: { authorization: string }): Promise<void> {
    return await this.api.logout(request);
  }
}