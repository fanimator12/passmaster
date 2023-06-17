/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactNode } from "react";
import { createContext, useState, useContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  logIn: () => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logIn = () => {
    setIsAuthenticated(true);
  };

  const logOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
