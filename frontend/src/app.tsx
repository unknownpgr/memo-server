import {
  createBrowserRouter,
  Link,
  Navigate,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages/main";
import { Settings } from "./pages/settings";
import { useObservable } from "./adapter/useObservable";
import { di } from "./di";
import { Loading } from "./pages/loading";

function NotFound() {
  const path = useLocation();
  if (path.pathname === "/index.html") {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Path {path.pathname} not found</h1>
      <Link to="/" className="text-blue-500">
        Go to home
      </Link>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/memo/:id",
    element: <Home />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export function App() {
  const auth = useObservable(di.authService);
  if (auth.getAuthState() === "verifying") return <Loading />;
  if (auth.getAuthState() === "unauthorized") return <Login />;
  return <RouterProvider router={router} />;
}
