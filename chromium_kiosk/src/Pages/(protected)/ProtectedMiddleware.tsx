import React, { PropsWithChildren, ReactElement, ReactNode, useEffect } from 'react'
import { useGlobalContext } from '../../Context/GlobalProvider';

const ProtectedMiddleware = ({children}: {children:ReactElement}) => {
    const { isLoading, isLoggedIn, user } = useGlobalContext();
    useEffect(() => {
        if (isLoading) {
            const accessToken = window.localStorage.getItem('token');
            if (!accessToken) {
                window.location.href = '/'
            }
        }
    }, [isLoggedIn, isLoading, user])

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedMiddleware