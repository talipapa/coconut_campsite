import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loadUser } from "../Utils/AuthService";
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



const GlobalContext = createContext<AuthContextType | undefined>({
    isLoggedIn: true,
    user: null,
    setUser: () => {},
    isLoading: true,
    setIsLoggedIn: () => {},
    setIsLoading: () => {},
    test: 'unflag',
    setTest: () => {},
    prices: [],
    setPrices: () => {},
});

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
        const initialize = async (): Promise<void> => {
          try {
            const accessToken = window.localStorage.getItem('token');
            if (accessToken) {
                const user = await loadUser()
                setUser(user)
                setIsLoggedIn(true)
                setIsLoading(false)
            } else {
                setUser(null)
                setIsLoggedIn(false)
            }
          } catch (err) {
            console.error(err);
            // Dispatch INITIALIZE action with default data in case of any error
            setUser(null)
            setIsLoggedIn(false)
          } 
        };
    
        // Call the initialize function on component mount
        initialize();
      }, [setUser, setIsLoggedIn, setIsLoading]);


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