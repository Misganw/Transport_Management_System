import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useContext(AppContext);
  return isLoggedIn ? children : <Navigate to="/" replace />;
}
