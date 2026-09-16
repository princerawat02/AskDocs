import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ChatPage } from "./pages/ChatPage";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { getCurrentUser } from "./services/auth.api";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Home />} />
        <Route path="/app/chat/:chatId" element={<ChatPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}

function ProtectedRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then(() => {
        if (active) setStatus("authenticated");
      })
      .catch(() => {
        if (active) setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default App;
