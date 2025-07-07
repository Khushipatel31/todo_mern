import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Todos from "../pages/user/Todos";
import AdminDashboard from "../pages/admin/Dashboard";
import useAuth from "../auth/useAuth";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={user ? (user.role === "admin" ? "/admin" : "/todos") : "/login"}
          />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/todos"
        element={user?.role === "user" ? <Todos /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin"
        element={
          user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
