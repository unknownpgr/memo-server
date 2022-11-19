import { telefunc, config } from "telefunc";
import type { NextApiRequest, NextApiResponse } from "next";
import assert from "assert";
import { getSession } from "../../session/getSession";

config.telefuncUrl = "/api/_telefunc";

export default async function telefuncMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  const { url, method, body } = req;
  assert(url && method);
  const httpRequest = {
    url,
    method,
    body,
    context: { session },
  };
  const httpResponse = await telefunc(httpRequest);
  res.status(httpResponse.statusCode).send(httpResponse.body);
}
