import { getIronSession } from "iron-session/edge";
import { options } from "./session";

export const getSession = async (req: Request, res: Response) =>
  getIronSession(req, res, options);
