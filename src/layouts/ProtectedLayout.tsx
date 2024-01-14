import { useContext } from "react"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider"

type Props = {
    role: "admin" | "user"
}

const ProtectedLayout = ({ role }: Props) => {
    const { auth } = useContext(AuthContext);
    const location = useLocation();

  return auth.role === role ? (
    <Outlet />
  ) : (
    <>
        {/* from: "/dashboard" */}
        <Navigate to={"/login"} state={{ from: location }} replace />
    </>
  );
};

export default ProtectedLayout