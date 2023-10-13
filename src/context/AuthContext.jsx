import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setPhotoURL(user.photoURL);
      } else {
        setCurrentUser(null);
        setPhotoURL(null);
      }
    });
  }, [auth]);
  return (
    <AuthContext.Provider value={{ user: currentUser, userPhoto: photoURL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
