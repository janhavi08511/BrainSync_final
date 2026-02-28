import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TranslationPage from "./pages/TranslationPage";
import HistoryPage from "./pages/HistoryPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import type { ReactNode } from "react";

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  protected?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: "Home",
    path: "/",
    element: <LandingPage />,
    visible: true,
    protected: false,
  },
  {
    name: "Login",
    path: "/login",
    element: <LoginPage />,
    visible: false,
    protected: false,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    visible: true,
    protected: true,
  },
  {
    name: "Translate",
    path: "/translate",
    element: (
      <ProtectedRoute>
        <TranslationPage />
      </ProtectedRoute>
    ),
    visible: true,
    protected: true,
  },
  {
    name: "History",
    path: "/history",
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
    visible: true,
    protected: true,
  },
];

export default routes;
