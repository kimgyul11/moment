import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "@shared/Navbar";
import { useModalContext } from "../context/ModalContext";
import Modal from "@shared/Modal";
import CreateMoment from "@components/moment/CreateMoment";
import { auth } from "../utils/firebase";
import { AnimatePresence } from "framer-motion";

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Layout = () => {
  const { isShow } = useModalContext();

  const user = auth.currentUser;

  return (
    <>
      <AnimatePresence>
        {isShow && (
          <Modal>
            <CreateMoment />
          </Modal>
        )}
      </AnimatePresence>
      <Wrap>
        <Navbar user={user} />
        <Outlet />
      </Wrap>
    </>
  );
};

export default Layout;
