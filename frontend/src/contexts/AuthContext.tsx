/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactNode } from "react";
import { createContext, useState, useContext } from "react";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  logIn: (token: string) => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  logIn: () => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const logIn = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const logOut = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
