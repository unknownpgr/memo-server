import { Body, Delete, Get, Header, Path, Post, Put, Route } from "tsoa";
import { AuthService } from "../core/authService";
import { Memo } from "../core/entity";
import { MemoService } from "../core/memoService";

@Route("/")
export class MemoController {
  private static memoService: MemoService;
  private static authService: AuthService;

  public static injectDependencies(
    memoService: MemoService,
    authService: AuthService
  ) {
    MemoController.memoService = memoService;
    MemoController.authService = authService;
  }

  @Post("login")
  public async login(
    @Body() { password }: { password: string }
  ): Promise<string> {
    return MemoController.authService.login(password);
  }

  @Delete("logout")
  public async logout(@Header("authorization") token: string): Promise<void> {
    return MemoController.authService.logout(token);
  }

  @Get("memo/{memoId}")
  public async findMemo(
    @Path() memoId: number,
    @Header("authorization") token: string
  ): Promise<Memo> {
    MemoController.authService.authorize(token);
    return MemoController.memoService.findMemo({ memoId });
  }

  @Get("memo")
  public async listMemo(@Header("authorization") token: string) {
    MemoController.authService.authorize(token);
    return MemoController.memoService.listMemo();
  }

  @Post("memo")
  public async createMemo(
    @Header("authorization") token: string
  ): Promise<Memo> {
    MemoController.authService.authorize(token);
    return MemoController.memoService.createMemo();
  }

  @Put("memo/{memoId}")
  public async updateMemo(
    @Path() memoId: number,
    @Body() { memo }: { memo: Memo },
    @Header("authorization") token: string
  ): Promise<Memo> {
    MemoController.authService.authorize(token);
    return MemoController.memoService.updateMemo({ memo });
  }

  @Delete("memo/{memoId}")
  public async deleteMemo(
    @Path() memoId: number,
    @Header("authorization") token: string
  ): Promise<void> {
    MemoController.authService.authorize(token);
    return MemoController.memoService.deleteMemo({ memoId });
  }

  @Get("backup")
  public async listBackups(
    @Header("authorization") token: string
  ): Promise<string[]> {
    MemoController.authService.authorize(token);
    return MemoController.memoService.listBackups();
  }

  @Post("backup")
  public async backupMemo(
    @Header("authorization") token: string
  ): Promise<void> {
    MemoController.authService.authorize(token);
    return MemoController.memoService.backupMemo();
  }
}
