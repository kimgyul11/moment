import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Layout = () => {
  return (
    <Wrap>
      <Navbar />
      <Outlet />
    </Wrap>
  );
};

export default Layout;
