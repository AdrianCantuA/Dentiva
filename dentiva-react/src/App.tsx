import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import { isAuthed } from "./logic/auth";
import type { ReactNode } from "react";

function PrivateRoute({ children }: { children: ReactNode }) {
  return isAuthed() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}
