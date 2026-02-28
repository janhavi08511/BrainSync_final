import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "@/components/common/Header";
import { Toaster } from "@/components/ui/toaster";
import { FloatingActionButton } from "@/components/common/FloatingActionButton";
import { AuthProvider } from "@/contexts/AuthContext";
import routes from "./routes";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <FloatingActionButton />
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
