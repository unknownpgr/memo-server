import { Body, Delete, Get, Header, Path, Post, Put, Route } from "tsoa";
import { MemoService } from "../core/memoService";
import { Memo } from "../core/entity";
import { AuthService } from "../core/authService";
import { JsonFileRepository } from "./repository";

// All dependencies are injected here.
// For simplicity, dependency injection framework is not used.

const repository = new JsonFileRepository();
const memoService = new MemoService(repository);
const authService = new AuthService(memoService);

@Route("/")
export class MemoController {
  @Post("login")
  public async login(
    @Body() { password }: { password: string }
  ): Promise<string> {
    return authService.authenticate(password);
  }

  @Delete("logout")
  public async logout(@Header("authorization") token: string): Promise<void> {
    return authService.deauthenticate(token);
  }

  @Get("memo/{memoId}")
  public async findMemo(
    @Path() memoId: number,
    @Header("authorization") token: string
  ): Promise<Memo> {
    const userId = authService.authorize(token);
    return memoService.findMemo({ memoId });
  }

  @Get("memo")
  public async listMemo(@Header("authorization") token: string) {
    const userId = authService.authorize(token);
    return memoService.listMemo();
  }

  @Post("memo")
  public async createMemo(
    @Header("authorization") token: string
  ): Promise<Memo> {
    const userId = authService.authorize(token);
    return memoService.createMemo();
  }

  @Put("memo/{memoId}")
  public async updateMemo(
    @Path() memoId: number,
    @Body() { memo }: { memo: Memo },
    @Header("authorization") token: string
  ): Promise<Memo> {
    const userId = authService.authorize(token);
    return memoService.updateMemo({ memo });
  }

  @Delete("memo/{memoId}")
  public async deleteMemo(
    @Path() memoId: number,
    @Header("authorization") token: string
  ): Promise<void> {
    const userId = authService.authorize(token);
    return memoService.deleteMemo({ memoId });
  }
}
