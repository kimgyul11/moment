import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <ModalContext.Provider value={{ isShow, setIsShow }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  return useContext(ModalContext);
};
