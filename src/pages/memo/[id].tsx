import React, { useState } from "react";

import { IMemo } from "../../types";
import Tags from "../../components/TagSelector";
import memoStyles from "../../styles/memo.module.css";
import { useRouter } from "next/router";
import { get, put } from "../../api";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { findMemo } from "../../logic/logic";

interface IViewProps {
  initialMemo: IMemo | null;
}

export const getServerSideProps: GetServerSideProps<IViewProps> = async (
  context
) => {
  const { id } = context.query;
  let nid = new Number(id);
  const initialMemo = await findMemo(+nid);
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
    const memo = await get<IMemo>(`/api/memo/${id}`);
    setContent(memo.content);
    setTags(memo.tags.map((x) => x.value));
    setIsLoading(false);
  }

  async function updateMemo() {
    setIsChanged(false);
    await put(`/api/memo/${id}`, {
      content,
      tags,
    });
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
