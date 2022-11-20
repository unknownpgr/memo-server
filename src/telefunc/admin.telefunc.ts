import { Abort, getContext } from "telefunc";
import { getUser, listUsers } from "../logic/admin";

function assertAdmin() {
  const context = getContext();
  if (!context.session.user) throw Abort("Unauthorized");
  if (context.session.user.id !== 1) throw Abort("Unauthenticated");
}

export async function onListUsers() {
  assertAdmin();
  return listUsers();
}

export async function onGetSessionOfUser({ userId }: { userId: number }) {
  assertAdmin();
  const { session } = getContext();
  const user = await getUser({ userId });
  if (!user) return null;
  session.destroy();
  session.user = user;
  await session.save();
  return user;
}
