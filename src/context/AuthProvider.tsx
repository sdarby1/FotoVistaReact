import { createContext, useState, ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

// DO NOT STORE PASSWORDS IN CONTEXT
type Auth = {
    id: number | null;
    username: string | null;
    role: 'admin' | 'user' | null;
    email: string | null;
    profileImageUrl: string | null; // Neue Eigenschaft für das Profilbild
};


type AuthContext = {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
};

export const defaultAuth: Auth = {
    id: null,
    username: null,
    role: null,
    email: null,
    profileImageUrl: null // Standardwert hinzugefügt
};


const defaultAuthContext = {
    auth: defaultAuth,
    setAuth: () => {}
} as AuthContext;

export const AuthContext = createContext<AuthContext>(defaultAuthContext);

const AuthProvider = ({ children }: Props) => {
    const [auth, setAuth] = useState<Auth>(defaultAuth);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;