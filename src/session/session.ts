import { IronSessionOptions } from "iron-session/edge";

export const options: IronSessionOptions = {
  cookieName: "memo-server",
  password: process.env.COOKIE_KEY || "C00KI3-K3Y",
};
