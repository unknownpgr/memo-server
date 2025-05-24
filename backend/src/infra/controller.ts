import {
  Body,
  Delete,
  Get,
  Header,
  Path,
  Post,
  Put,
  Response,
  Route,
} from "tsoa";
import { AuthService } from "../core/authService";
import { Memo } from "../core/entity";
import { MemoService } from "../core/memoService";
import {
  HashMismatchError,
  MemoNotFoundError,
  UnauthorizedError,
} from "../core/errors";

const error400 = {
  status: 400,
  message: "Bad Request",
};

const error401 = {
  status: 401,
  message: "Unauthorized",
};

const error404 = {
  status: 404,
  message: "Not Found",
};

const error500 = {
  status: 500,
  message: "Internal Server Error",
};

function convertErrorToResponse(error: any) {
  if (error instanceof UnauthorizedError) {
    return error401;
  }
  if (error instanceof MemoNotFoundError) {
    return error404;
  }
  if (error instanceof HashMismatchError) {
    return error400;
  }
  return error500;
}

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
  @Response(401, "Unauthorized")
  public async login(
    @Body() { password }: { password: string }
  ): Promise<string> {
    try {
      return await MemoController.authService.login(password);
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }

  @Delete("logout")
  public async logout(@Header("authorization") token: string): Promise<void> {
    try {
      return await MemoController.authService.logout(token);
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }

  @Get("memo/{memoId}")
  public async findMemo(
    @Path() memoId: number,
    @Header("authorization") token: string
  ): Promise<Memo> {
    try {
      MemoController.authService.authorize(token);
      return MemoController.memoService.findMemo({ memoId });
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }

  @Get("memo")
  public async listMemo(@Header("authorization") token: string) {
    try {
      MemoController.authService.authorize(token);
      return MemoController.memoService.listMemo();
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }

  @Post("memo")
  public async createMemo(
    @Header("authorization") token: string
  ): Promise<Memo> {
    try {
      MemoController.authService.authorize(token);
      return MemoController.memoService.createMemo();
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }

  @Put("memo/{memoId}")
  public async updateMemo(
    @Path() memoId: number,
    @Body() { memo, previousHash }: { memo: Memo; previousHash: string },
    @Header("authorization") token: string
  ): Promise<Memo> {
    try {
      MemoController.authService.authorize(token);
      return MemoController.memoService.updateMemo({ memo, previousHash });
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }

  @Delete("memo/{memoId}")
  public async deleteMemo(
    @Path() memoId: number,
    @Header("authorization") token: string
  ): Promise<void> {
    try {
      MemoController.authService.authorize(token);
      return MemoController.memoService.deleteMemo({ memoId });
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }

  @Get("backup")
  public async listBackups(
    @Header("authorization") token: string
  ): Promise<string[]> {
    try {
      MemoController.authService.authorize(token);
      return MemoController.memoService.listBackups();
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }

  @Post("backup")
  public async backupMemo(
    @Header("authorization") token: string
  ): Promise<void> {
    try {
      MemoController.authService.authorize(token);
      return MemoController.memoService.backupMemo();
    } catch (error) {
      throw convertErrorToResponse(error);
    }
  }
}
