import React, { useState } from "react";

import { IMemo } from "../../global";
import Tags from "../../components/TagSelector";
import memoStyles from "../../styles/memo.module.css";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { findMemo } from "../../logic/logic";
import { onGetMemo, onUpsertMemo } from "../index.telefunc";
import int from "../../tools/num";

interface IViewProps {
  initialMemo: IMemo | null;
}

const getViewProps = (message: string): { props: IViewProps } => ({
  props: {
    initialMemo: {
      id: -1,
      content: message,
      tags: [],
    },
  },
});

export const getServerSideProps: GetServerSideProps<IViewProps> = async (
  context
) => {
  const { id } = context.query;
  const { user } = context.req.session;
  if (!user) return getViewProps("");
  const initialMemo = await findMemo(user.id, int(id));
  return {
    props: {
      initialMemo,
    },
  };
};

export default function View({
  initialMemo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [content, setContent] = useState(initialMemo?.content || "");
  const [tags, setTags] = useState<string[]>(
    initialMemo?.tags.map((x) => x.value) || []
  );

  async function update() {
    const memo = await onGetMemo(int(id));
    if (!memo) return;
    setContent(memo.content);
    setTags(memo.tags.map((x) => x.value));
    setIsLoading(false);
  }

  async function updateMemo() {
    setIsChanged(false);
    onUpsertMemo(content, tags, int(id));
    update();
  }

  return (
    <div>
      <h1>
        Memo #{id}{" "}
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
