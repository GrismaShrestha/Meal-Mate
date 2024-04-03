import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <p>Hehe</p>,
      },
    ],
  },
]);
