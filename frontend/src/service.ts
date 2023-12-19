import { DefaultService, Memo } from "./api";

export class MemoService {
  private api = DefaultService;
  private token: string = "";

  constructor() {
    const token = localStorage.getItem("token");
    if (token) this.token = token;
  }

  private authorized() {
    if (!this.token) throw new Error("Not authorized");
  }

  public async login(username: string, password: string) {
    const token = await this.api.login({
      requestBody: { username, password },
    });
    localStorage.setItem("token", token);
    this.token = token;
  }

  public async logout() {
    this.authorized();
    await this.api.logout({ authorization: this.token });
    localStorage.removeItem("token");
    this.token = "";
  }

  public async register(username: string, password: string) {
    await this.api.register({
      requestBody: { username, password },
    });
  }

  public isLoggedIn() {
    return !!this.token;
  }

  public async findMemo(memoId: number) {
    this.authorized();
    return await this.api.findMemo({
      memoId,
      authorization: this.token,
    });
  }

  public async listMemo() {
    this.authorized();
    return await this.api.listMemo({
      authorization: this.token,
    });
  }

  public async createMemo() {
    this.authorized();
    return await this.api.createMemo({
      authorization: this.token,
    });
  }

  public async updateMemo(memo: Memo) {
    this.authorized();
    return await this.api.updateMemo({
      memoId: memo.id,
      authorization: this.token,
      requestBody: { memo },
    });
  }

  public async deleteMemo(memoId: number) {
    this.authorized();
    return await this.api.deleteMemo({
      memoId,
      authorization: this.token,
    });
  }
}

export const memoService = new MemoService();
