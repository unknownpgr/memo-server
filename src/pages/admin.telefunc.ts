import { Abort, getContext } from "telefunc";
import { listUsers } from "../logic/admin";

function assertAdmin() {
  const context = getContext();
  if (!context.session.user) throw Abort("Unauthorized");
  if (context.session.user.id !== 1) throw Abort("Unauthenticated");
}

export async function onListUsers() {
  assertAdmin();
  return listUsers();
}
