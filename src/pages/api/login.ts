import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "../../session/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      if (req.body.password === process.env.PASSWORD) {
        req.session.user = { isLoggedIn: true };
        await req.session.save();
        res.status(200).end();
      } else {
        req.session.destroy();
        res.status(401).end();
      }
      break;
    case "GET":
      res.send(req.session.user?.isLoggedIn || false);
      break;
  }
}

export default withSession(handler);
