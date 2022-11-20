import React, { useState } from "react";

import { IMemo } from "../../global";
import Tags from "../../components/TagSelector";
import memoStyles from "../../styles/memo.module.css";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next";
import { findMemo } from "../../logic/logic";
import { onGetMemo, onUpsertMemo } from "../index.telefunc";
import int from "../../tools/num";
import { withSession } from "../../session/withSession";

type IViewProps = {
  initialMemo: IMemo | null;
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
    },
  };
});

export default function View({
  initialMemo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { number } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [content, setContent] = useState(initialMemo?.content || "");
  const [tags, setTags] = useState<string[]>(
    initialMemo?.tags.map((x) => x.value) || []
  );

  async function update() {
    const memo = await onGetMemo(int(number));
    if (!memo) return;
    setContent(memo.content);
    setTags(memo.tags.map((x) => x.value));
    setIsLoading(false);
  }

  async function updateMemo() {
    setIsChanged(false);
    onUpsertMemo(content, tags, int(number));
    update();
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
          setIsChanged(true);
        }}
      ></textarea>
      <Tags
        tags={tags}
        setTags={(v) => {
          setTags(v);
          setIsChanged(true);
        }}
      ></Tags>
    </div>
  );
}
