import React from "react";
import styled from "styled-components";
import { useModalContext } from "../context/ModalContext";
import { GrClose } from "react-icons/gr";
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

const ModalContainer = styled.div`
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
  animation: slide-up-fade-in 0.4s ease-out forwards;
  @media (max-width: 700px) {
    width: 100vh;
    max-height: 800px;
  }
  @keyframes slide-up-fade-in {
    0% {
      transform: translateY(30px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
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
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <GrClose />
        </CloseButton>
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
