import { onGetMemo, onUpdateMemo } from "../../telefunc/index.telefunc";

import { InferGetServerSidePropsType } from "next";
import { useEffect, useRef, useState } from "react";
import Tags from "../../components/TagSelector";
import { IMemo } from "../../global";
import { findMemo } from "../../logic/logic";
import { withSession } from "../../session/withSession";
import memoStyles from "../../styles/memo.module.css";
import int from "../../tools/num";

type IViewProps = {
  initialMemo: IMemo | null;
  number: number;
};

export const getServerSideProps = withSession<IViewProps>(async (context) => {
  const { number } = context.query;
  const { user } = context.req.session;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  const initialMemo = await findMemo({ userId: user.id, number: int(number) });
  return {
    props: {
      initialMemo,
      number: int(number),
    },
  };
});

export default function View({
  initialMemo,
  number,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(initialMemo?.content || "");
  const [tags, setTags] = useState<string[]>(
    initialMemo?.tags.map((x) => x.value) || []
  );
  const debouncingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsSaving(true);
    const timeout = setTimeout(async () => {
      if (debouncingRef.current !== timeout) return;
      await onUpdateMemo(content, tags, int(number));
      setIsSaving(false);
    }, 1000);
    debouncingRef.current = timeout;
  }, [number, content, tags]);

  return (
    <div>
      This is memo number {number}.{" "}
      {isSaving
        ? "It's being saved, so please wait."
        : "This memo is safely stored."}
      <textarea
        className={memoStyles.content}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <Tags tags={tags} setTags={(v) => setTags(v)}></Tags>
    </div>
  );
}
