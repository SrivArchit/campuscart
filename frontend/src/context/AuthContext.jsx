import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Read the saved user before the first render, so protected pages don't
// redirect a logged-in user to /login on a hard refresh.
const loadStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("campuscart_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("campuscart_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campuscart_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);