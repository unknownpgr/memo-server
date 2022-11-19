import { getContext } from "telefunc";
import { addUser, verifyUser } from "../logic/logic";

export async function onSignUp(username: string, password: string) {
  return await addUser(username, password);
}

export async function onSignIn(username: string, password: string) {
  const { session } = getContext();
  const user = await verifyUser(username, password);
  if (!user) return null;
  session.user = user;
  await session.save();
  return user;
}

export async function onSignOut() {
  const { session } = getContext();
  session.destroy();
}

export async function onGetUser() {
  const { session } = getContext();
  const { user } = session;
  if (!user) return null;
  return user;
}
