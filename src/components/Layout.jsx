import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import { useModalContext } from "../context/ModalContext";
import Modal from "./Modal";
import CreateMoment from "./CreateMoment";
import { auth } from "../utils/firebase";
import { useEffect, useState } from "react";

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
      {isShow && (
        <Modal>
          <CreateMoment />
        </Modal>
      )}

      <Wrap>
        <Navbar user={user} />
        <Outlet />
      </Wrap>
    </>
  );
};

export default Layout;
