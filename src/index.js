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
import BetManagerPage from "./components/routes/BetManagerPage";
import ManageGroupPage from "./components/routes/ManageGroupPage";
import UserBetsPage from "./components/routes/UserBetsPage";
import HomePage from "./components/routes/HomePage";

import ".//styles/styles.css";

import { AuthProvider } from "./components/providers/AuthContext";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ModalProvider } from "./components/providers/ModalContext";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/wallet",
    element: <WalletPage/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bets",
    element: <BetPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-up",
    element: <SignupPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/create-group",
    element: <NewGroupPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bets-placed",
    element: <UserBetsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/create-bet",
    element: <CreateBetPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/manage-bets",
    element: <BetManagerPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/your-groups",
    element: <ManageGroupPage />,
    errorElement: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </AuthProvider>
  </React.StrictMode>
);