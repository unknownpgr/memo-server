import { Abort, getContext } from "telefunc";
import {
  clearUnrelatedTags,
  deleteMemo,
  findMemo,
  listMemo,
  listTags,
  upsertMemo,
} from "../logic/logic";

function auth() {
  const context = getContext();
  const { user } = context.session;
  if (!user) throw Abort("Unauthorized");
  return user;
}

export async function onListMemo(tags?: string[]) {
  const user = auth();
  return listMemo(user.id, tags);
}

export async function onListTags() {
  const user = auth();
  return listTags(user.id);
}

export async function onGetMemo(id: number) {
  const user = auth();
  return findMemo(user.id, id);
}

export async function onUpsertMemo(
  content: string,
  tags: string[],
  id?: number
) {
  const user = auth();
  const memo = await upsertMemo(user.id, content, tags, id);
  await clearUnrelatedTags(user.id);
  return memo;
}

export async function onDeleteMemo(id: number) {
  const user = auth();
  const memo = await deleteMemo(user.id, id);
  await clearUnrelatedTags(user.id);
  return memo;
}
