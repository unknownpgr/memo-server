import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "./session";

export const getSession = async (
  req: NextApiRequest | NextRequest,
  res: NextApiResponse | NextResponse
) => getIronSession(req, res, options);
