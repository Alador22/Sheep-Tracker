//Alador
/**
 * dette er logikken som håndterer pålogget og utlogget tilstand på nettstedet.
 * sender en bruker til påloggingssiden hvis enten økten er ferdig og/eller det finnes ikke et token i local storage
 * det gjør også det motsatte, så hvis det er et token, blir brukeren automatisk logget på og sendt til hjemmesiden
 */
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Denne funksjonen sjekker tokenet i local storage for å oppdatere påloggingsstatus
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus); // Listen to storage changes

    return () => {
      window.removeEventListener("storage", checkAuthStatus); // Cleanup listener
    };
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
