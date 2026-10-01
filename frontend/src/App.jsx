import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AIAssistant from "./pages/AIAssistant";

import "./App.css";

function App() {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token
              ? user?.role === "admin"
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={
            token
              ? user?.role === "admin"
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Login />
          }
        />

        <Route
          path="/register"
          element={
            token
              ? user?.role === "admin"
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Register />
          }
        />

        <Route
          path="/dashboard"
          element={
            token
              ? <Dashboard />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/admin"
          element={
            token && user?.role === "admin"
              ? <AdminDashboard />
              : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/ai"
          element={
            token
              ? <AIAssistant />
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;