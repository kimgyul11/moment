import React from "react";
import styled from "styled-components";
import { useModalContext } from "../context/ModalContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContainer = styled.div`
  background: white;
  position: relative;
  padding: 20px;
  border-radius: 15px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  width: 60vh;
  max-width: 400px;
  max-height: 500px;
  height: 70vh;
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
      <ModalContainer>
        <CloseButton onClick={onClose}>❌</CloseButton>
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
