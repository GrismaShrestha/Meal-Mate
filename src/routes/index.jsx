import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Homepage from "./Homepage";
import GetStarted from "./GetStarted";

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
  {
    path: "/get-started",
    element: <GetStarted />,
  },
]);
