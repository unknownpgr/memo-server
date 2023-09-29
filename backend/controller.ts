import { Body, Delete, Get, Header, Path, Post, Put, Route } from "tsoa";
import { MemoService } from "./service";
import { Memo } from "./entity";
import { PrismaRepository } from "./repository";
import { AuthService } from "./authService";

// All dependencies are injected here.
// For simplicity, dependency injection framework is not used.

const repository = new PrismaRepository();
const memoService = new MemoService(repository);
const authService = new AuthService(memoService);

@Route("/")
export class MemoController {
  @Post("login")
  public async login(
    @Body() { username, password }: { username: string; password: string }
  ): Promise<string> {
    return authService.authenticate(username, password);
  }

  @Delete("logout")
  public async logout(@Header("authorization") token: string): Promise<void> {
    return authService.deauthenticate(token);
  }

  @Post("register")
  public async register(
    @Body() { username, password }: { username: string; password: string }
  ): Promise<void> {
    await memoService.createUser({ username, password });
  }

  @Get("memo/{number}")
  public async findMemo(
    @Path() number: number,
    @Header("authorization") token: string
  ): Promise<Memo> {
    const userId = authService.authorize(token);
    return memoService.findMemo({ userId, number });
  }

  @Get("memo")
  public async listMemo(@Header("authorization") token: string) {
    const userId = authService.authorize(token);
    return memoService.listMemo({ userId });
  }

  @Post("memo")
  public async createMemo(
    @Body() { content, tags }: { content: string; tags: string[] },
    @Header("authorization") token: string
  ): Promise<Memo> {
    const userId = authService.authorize(token);
    return memoService.createMemo({ userId, content, tags });
  }

  @Put("memo/{number}")
  public async updateMemo(
    @Path() number: number,
    @Body() { content, tags }: { content: string; tags: string[] },
    @Header("authorization") token: string
  ): Promise<Memo> {
    const userId = authService.authorize(token);
    return memoService.updateMemo({ userId, number, content, tags });
  }

  @Delete("memo/{number}")
  public async deleteMemo(
    @Path() number: number,
    @Header("authorization") token: string
  ): Promise<void> {
    const userId = authService.authorize(token);
    return memoService.deleteMemo({ userId, number });
  }
}
