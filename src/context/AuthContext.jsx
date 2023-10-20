import { createContext, useContext, useEffect, useState } from "react";
import { auth, onLogOut } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        uid: currentUser && currentUser.uid,
        onLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
