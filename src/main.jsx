import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "@fontsource/inter"
import "@fontsource/inter/100.css"
import "@fontsource/inter/200.css"
import "@fontsource/inter/300.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"
import "@fontsource/inter/800.css"
import "@fontsource/inter/900.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
