import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Homepage from "./Homepage";
import GetStarted from "./GetStarted";
import RegisterUser from "./RegisterUser";
import LoginUser from "./LoginUser";

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
  {
    path: "/register/user",
    element: <RegisterUser />,
  },
  {
    path: "/login/user",
    element: <LoginUser />,
  },
]);
