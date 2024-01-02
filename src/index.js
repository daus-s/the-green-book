import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import WalletPage from "./components/routes/WalletPage";
import BetPage from "./components/routes/BetPage";
import ErrorPage from "./components/routes/ErrorPage";

import { AuthProvider } from "./components/AuthContext";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthPage from "./components/routes/AuthPage";
import SignupPage from "./components/routes/SignupPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/wallet",
    element: <WalletPage/>,
    /*todo make authorized error page*/
  },
  {
    path: "/bets",
    element: <BetPage />,
    /*todo make authorized error page*/
  },
  {
    path: "/login",
    element: <AuthPage />,
    /*todo make authorized error page*/
  },
  {
    path: "/sign-up",
    element: <SignupPage />,
    /*todo make authorized error page*/
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);