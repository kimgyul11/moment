import React from "react";
import styled from "styled-components";
import { GrClose } from "react-icons/gr";
import { AnimatePresence, motion } from "framer-motion";
import { useModalContext } from "@context/ModalContext";
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.792);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  position: relative;
  padding: 20px;
  border-radius: 15px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  width: 70vh;
  max-width: 500px;
  max-height: 600px;
  height: 90vh;

  @media (max-width: 700px) {
    width: 100vh;
    max-height: 800px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  background: white;
  top: 10px;
  right: 10px;
  font-size: 1.2rem;

  border: none;
  cursor: pointer;
`;
const Modal = ({ children }) => {
  const { setIsShow } = useModalContext();
  const onClose = () => {
    setIsShow(false);
  };
  return (
    <ModalOverlay>
      <ModalContainer
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <CloseButton onClick={onClose}>
          <GrClose />
        </CloseButton>
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
