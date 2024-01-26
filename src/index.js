import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import WalletPage from "./components/routes/WalletPage";
import BetPage from "./components/routes/BetPage";
import ErrorPage from "./components/routes/ErrorPage";
import AuthPage from "./components/routes/AuthPage";
import SignupPage from "./components/routes/SignupPage";
import NewGroupPage from "./components/routes/NewGroupPage";
import ProfilePage from "./components/routes/ProfilePage";
import CreateBetPage from "./components/routes/CreateBetPage";
import ForgotPasswordPage from "./components/routes/ForgotPasswordPage";
import ResetPasswordPage from "./components/routes/ResetPasswordPage";

import { AuthProvider } from "./components/AuthContext";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BetPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/wallet",
    element: <WalletPage/>,
  },
  {
    path: "/bets",
    element: <BetPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/sign-up",
    element: <SignupPage />,
  },
  {
    path: "/create-group",
    element: <NewGroupPage />,
  },
  {
    path: "/create-bet",
    element: <CreateBetPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);