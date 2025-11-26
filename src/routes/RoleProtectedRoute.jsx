import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  if (!token) return <Navigate to="/login" replace />;

  if (userRole !== role) {
    return <Navigate to="/" replace />; 
  }

  return children;
}
