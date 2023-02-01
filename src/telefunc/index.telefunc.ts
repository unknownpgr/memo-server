import { Abort, getContext } from "telefunc";
import {
  clearUnrelatedTags,
  createMemo,
  deleteMemo,
  findMemo,
  listMemo,
  listTags,
  updateMemo,
} from "../logic/logic";

function auth() {
  const context = getContext();
  const { user } = context.session;
  if (!user) throw Abort("Unauthorized");
  return user;
}

export async function onListMemo(tags?: string[]) {
  const user = auth();
  return listMemo({ userId: user.id, tags });
}

export async function onListTags() {
  const user = auth();
  return listTags({ userId: user.id });
}

export async function onGetMemo(number: number) {
  const user = auth();
  return findMemo({ userId: user.id, number });
}

export async function onCreateMemo(content: string, tags: string[]) {
  const user = auth();
  const memo = await createMemo({ userId: user.id, content, tags });
  await clearUnrelatedTags({ userId: user.id });
  return memo;
}

export async function onUpdateMemo(
  content: string,
  tags: string[],
  number: number
) {
  const user = auth();
  const memo = await updateMemo({ userId: user.id, content, tags, number });
  await clearUnrelatedTags({ userId: user.id });
  return memo;
}

export async function onDeleteMemo(number: number) {
  const user = auth();
  const memo = await deleteMemo({ userId: user.id, number });
  await clearUnrelatedTags({ userId: user.id });
  return memo;
}
