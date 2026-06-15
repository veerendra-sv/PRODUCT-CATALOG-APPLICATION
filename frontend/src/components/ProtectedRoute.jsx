import { Navigate } from 'react-router-dom';
import { isLoggedIn, isAdmin } from '../services/api';

// Redirects to login if not authenticated
// If adminOnly=true, also checks for admin role
const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!isLoggedIn()) return <Navigate to="/" replace />;
    if (adminOnly && !isAdmin()) return <Navigate to="/home" replace />;
    return children;
};

export default ProtectedRoute;
