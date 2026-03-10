import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useContext(AuthContext);

    if(!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
}
export default ProtectedRoute;