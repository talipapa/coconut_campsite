import React from 'react'
import { useGlobalContext } from '../Context/GlobalProvider';
import { Outlet, Navigate } from "react-router-dom";


const ProtectedRoutes = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading && isLoggedIn) {
        return  <Outlet />  
    } else{
        <Navigate to='/login' />
    }
}

export default ProtectedRoutes