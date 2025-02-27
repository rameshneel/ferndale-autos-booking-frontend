// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Loading from "./Loading";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated === null) {
//     return (
//       <div>
//         <Loading />
//       </div>
//     );
//   }

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
// Yeh pura ProtectedRoute component replace kar do
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({
  children,
  redirectAuthenticated = false,
  to = "/admin",
  allowUnauthenticated = false,
}) => {
  const { isAuthenticated } = useAuth();
  // Initial loading state
  if (isAuthenticated === null) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  // Agar authenticated hai aur redirectAuthenticated true hai
  if (isAuthenticated && redirectAuthenticated) {
    return <Navigate to={to} replace />;
  }

  // Agar unauthenticated users ko allow karna hai (jaise login page ke liye)
  if (!isAuthenticated && allowUnauthenticated) {
    return children;
  }

  // Normal protected route logic
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
