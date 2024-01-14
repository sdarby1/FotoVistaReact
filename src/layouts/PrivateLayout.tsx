import { useContext } from "react"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider"

const PrivateLayout = () => {
    const { auth } = useContext(AuthContext);
    const location = useLocation();

  return auth.role ? (
    <Outlet />
  ) : (
    <>
        {/* from: "/dashboard" */}
        <Navigate to={"/login"} state={{ from: location }} replace />
    </>
  );
};

export default PrivateLayout