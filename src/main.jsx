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
import { useAdmin, useUser } from "./hooks/auth";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Homepage from "./routes/Homepage";
import GetStarted from "./routes/GetStarted";
import RegisterUser from "./routes/RegisterUser";
import LoginUser from "./routes/LoginUser";
import AdminLayout from "./routes/admin/AdminLayout";
import Dashboard from "./routes/admin/Dashboard";
import Users from "./routes/admin/Users";
import LoginAdmin from "./routes/admin/Login";
import UserDetails from "./routes/admin/UserDetails";

const queryClient = new QueryClient();

export function AuthCheck() {
  const {
    isLoading: isLoadingUser,
    isRefetching: isRefetchingUser,
    data: user,
  } = useUser();

  const {
    isLoading: isLoadingAdmin,
    isRefetching: isRefetchingAdmin,
    data: admin,
  } = useAdmin();

  if (
    (isLoadingUser && !isRefetchingUser) ||
    (isLoadingAdmin && !isRefetchingAdmin)
  ) {
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
      element: <GetStarted />,
    },

    // Register
    {
      path: "/register/user",
      element: user == null ? <RegisterUser /> : <Navigate to="/" replace />,
    },

    // Login
    {
      path: "/login/user",
      element: user == null ? <LoginUser /> : <Navigate to="/" replace />,
    },
    {
      path: "/login/admin",
      element:
        admin == null ? <LoginAdmin /> : <Navigate to="/admin" replace />,
    },

    // Admin
    // -----
    {
      path: "/admin",
      element:
        admin != null ? (
          <AdminLayout />
        ) : (
          <Navigate to="/login/admin" replace />
        ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "users/:id",
          element: <UserDetails />,
        },
      ],
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
