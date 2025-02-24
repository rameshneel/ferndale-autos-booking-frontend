import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div>
        <Loading />{" "}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;

// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// const ProtectedRout = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated === null) {
//     return <div>Loading...</div>; /
//   }

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
