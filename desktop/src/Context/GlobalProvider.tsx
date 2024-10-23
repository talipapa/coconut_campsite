import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loadUser } from "../utils/AuthService";

type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

type PriceType = {
    name: string,
    price: number,
}

type AuthContextType = {
    isLoggedIn: boolean;
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setIsLoading: (setIsLoading: boolean) => void;
    test: string;
    setTest: (test: string) => void;
    prices: PriceType[];
    setPrices: (prices: PriceType[]) => void;
};



const GlobalContext = createContext<AuthContextType | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};

const GlobalProvider = ({children}: {children: ReactNode}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [test, setTest] = useState('unflag')
    const [prices, setPrices] = useState<PriceType[]>([])

    useEffect(() => {
        setIsLoading(true)
        loadUser()
            .then((data) => {
                setUser(data)
                setIsLoggedIn(true)
            }).catch((error) => {
                console.log("Failed to load user", error);
                setUser(null)
                setIsLoggedIn(false)
            }).finally(() => {
                setIsLoading(false)
            })

        if (!isLoading && !isLoggedIn) {
            console.log('User is not logged in')
            window.electron.ipcRenderer.setWindowFullScreen(false)
        }

    }, [])

    return (
        <GlobalContext.Provider value={{
            isLoggedIn, 
            setIsLoggedIn, 
            user, 
            setUser, 
            isLoading, 
            setIsLoading, 
            test, 
            setTest,
            prices,
            setPrices
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;