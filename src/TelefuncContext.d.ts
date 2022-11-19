import { IronSession } from "iron-session";
import "telefunc";

declare module "telefunc" {
  namespace Telefunc {
    interface Context {
      session: IronSession;
    }
  }
}
