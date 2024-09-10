import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages/main";
import { Settings } from "./pages/settings";
import { useObservable } from "./adapter/useObservable";
import { di } from "./di";

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
]);

export function App() {
  const auth = useObservable(di.authService);
  if (auth.getAuthState() !== "authorized") return <Login />;
  return <RouterProvider router={router} />;
}
