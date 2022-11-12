import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { options } from "./session";

export const withSession = (handler: NextApiHandler) =>
  withIronSessionApiRoute(handler, options);
