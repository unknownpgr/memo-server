import { AuthServiceImpl } from "./core/authService";
import { AuthService } from "./core/model/auth";

import { MemoService } from "./core/memoService";
import { AuthRepositoryImpl } from "./infra/authRepository";
import { MemoRepositoryImpl } from "./infra/memoRepository";

const authRepository = new AuthRepositoryImpl();
const memoRepository = new MemoRepositoryImpl();

const authService = new AuthServiceImpl(authRepository);
const memoService = new MemoService(memoRepository, authService);

export const di: {
  authService: AuthService;
  memoService: MemoService;
} = {
  authService,
  memoService,
};
