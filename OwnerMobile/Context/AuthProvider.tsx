import {createContext} from 'react';

type AuthContextType = {
    user: {
        email: string
    };
    setUser: (user: any) => void;
};

const AuthContext = createContext<AuthContextType>({
    user: {
        email: "davilajohn810@gmail.com"
    },
    setUser: () => {}
});  

export default AuthContext;