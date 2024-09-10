import { MdArrowBack, MdBackup, MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useObservable } from "../adapter/useObservable";
import { di } from "../di";

export function Settings() {
  const service = useObservable(di.service);
  const navigate = useNavigate();
  const backups = service.getBackupList();

  async function signOut() {
    await service.logout();
    navigate("/login");
  }

  return (
    <div className="h-dvh flex flex-col">
      <div className="py-2 px-6 border-b flex">
        <Link className="p-2" to="/">
          <MdArrowBack />
        </Link>
      </div>
      <div>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <button className="flex items-center gap-1" onClick={signOut}>
            <MdLogout />
            Sign out
          </button>
          <h2 className="text-xl font-semibold mt-6 mb-2">Backups</h2>
          <button
            className="flex items-center gap-1"
            onClick={() => service.createBackup()}>
            <MdBackup />
            Create Backup
          </button>
          <ul className="mt-4">
            {backups.map((backupName) => {
              let dateString = backupName;
              const date = new Date(+backupName);
              if (!isNaN(date.getTime())) {
                dateString = date.toLocaleString();
              }
              return (
                <li key={backupName} className="flex items-center gap-2">
                  <span>- {dateString}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
