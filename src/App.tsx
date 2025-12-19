import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./logic/auth/PrivateRoute";

import Login from "./components/login";
import Onboarding from "./components/onboarding";
import Dashboard from "./components/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/onboarding"
        element={
          <PrivateRoute>
            <Onboarding />
          </PrivateRoute>
        }
      />

      {/* ✅ La URL queda: dentiva.tech/<slug>/dashboard */}
      <Route
        path="/:slug/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Opcional: redirección raíz */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
