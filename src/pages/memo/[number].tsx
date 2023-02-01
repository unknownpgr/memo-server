import { onGetMemo, onUpdateMemo } from "../../telefunc/index.telefunc";

import { InferGetServerSidePropsType } from "next";
import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [content, setContent] = useState(initialMemo?.content || "");
  const [tags, setTags] = useState<string[]>(
    initialMemo?.tags.map((x) => x.value) || []
  );

  async function refresh() {
    const memo = await onGetMemo(int(number));
    if (!memo) return;
    setContent(memo.content);
    setTags(memo.tags.map((x) => x.value));
    setIsLoading(false);
  }

  async function updateMemo() {
    setIsLoading(true);
    await onUpdateMemo(content, tags, int(number));
    await refresh();
    setIsChanged(false);
  }

  return (
    <div>
      <h1>
        Memo #{number}{" "}
        <button onClick={updateMemo} disabled={!isChanged}>
          [ update ]
        </button>
      </h1>
      <textarea
        className={memoStyles.content}
        disabled={isLoading}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (!isChanged) setIsChanged(true);
        }}
      ></textarea>
      <Tags
        tags={tags}
        setTags={(v) => {
          setTags(v);
          if (!isChanged) setIsChanged(true);
        }}
      ></Tags>
    </div>
  );
}
