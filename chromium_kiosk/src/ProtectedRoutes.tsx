import React from 'react';
import { useGlobalContext } from './Context/GlobalProvider';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const ProtectedRoutes = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();
    const location = useLocation();

    if (!isLoading && isLoggedIn) {
        // Redirect to /dashboard if trying to access the login page
        if (location.pathname === '/') {
            return <Navigate to='/dashboard' />;
        }
        return <Outlet />;
    } else {
        return <Navigate to='/' />;
    }
};

export default ProtectedRoutes;
