import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/main";
import Login from "./pages/login";
import Memo from "./pages/memo";
import { MemoService } from "./service";

const service = new MemoService();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login service={service} />,
  },
  {
    path: "/",
    element: <Home service={service} />,
  },
  {
    path: "/memo/:id",
    element: <Memo service={service} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
