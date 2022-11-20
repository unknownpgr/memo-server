import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IUser } from "../global";
import { withSession } from "../session/withSession";
import { onGetSessionOfUser, onListUsers } from "./admin.telefunc";

export const getServerSideProps = withSession(async (context) => {
  const { user } = context.req.session;
  if (!user || user.id !== 1)
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  return { props: {} };
});

export default function Admin() {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    (async () => {
      const users = await onListUsers();
      setUsers(users);
    })();
  }, []);

  async function onSignIn(userId: number) {
    await onGetSessionOfUser({ userId });
    router.push("/");
  }

  return (
    <div>
      <h1>Admin</h1>
      <h2>Users</h2>
      <ul>
        {users.map(({ id, username }) => (
          <li key={id}>
            #{id}. {username}{" "}
            <button onClick={() => onSignIn(id)}>[ Sign In ]</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
