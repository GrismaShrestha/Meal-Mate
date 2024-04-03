import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Homepage from "./Homepage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
    ],
  },
]);
