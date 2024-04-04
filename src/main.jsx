import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import "@fontsource/inter";
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./hooks/auth";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Homepage from "./routes/Homepage";
import GetStarted from "./routes/GetStarted";
import RegisterUser from "./routes/RegisterUser";
import LoginUser from "./routes/LoginUser";

const queryClient = new QueryClient();

export function AuthCheck() {
  const { isLoading, isRefetching, data } = useUser();
  if (isLoading && !isRefetching) {
    return null;
  }

  const router = createBrowserRouter([
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
      element: data == null ? <GetStarted /> : <Navigate to="/" replace />,
    },
    {
      path: "/register/user",
      element: data == null ? <RegisterUser /> : <Navigate to="/" replace />,
    },
    {
      path: "/login/user",
      element: data == null ? <LoginUser /> : <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthCheck />
      <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>,
);
