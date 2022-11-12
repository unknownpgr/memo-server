import { getIronSession, IronSessionOptions } from "iron-session/edge";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      isLoggedIn: boolean;
    };
  }
}

export const options: IronSessionOptions = {
  cookieName: "memo-server",
  password: process.env.COOKIE_KEY || "C00KI3-K3Y",
};
