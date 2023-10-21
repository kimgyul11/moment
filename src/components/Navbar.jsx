import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../utils/firebase";
import { useModalContext } from "../context/ModalContext";
import { BsPencil } from "react-icons/bs";
import { BiUserCircle, BiLogOut, BiSolidHome } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LiaSearchSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import useNotification from "../hooks/useNotification";
import NotificationCnt from "./notification/NotificationCnt";
const Nav = styled.div`
  min-width: 60px;
  max-width: 60px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 700px) {
    width: 100%;
    height: 50px;
    max-width: 100%;
    flex-direction: row;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
  }
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (max-width: 700px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Item = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  height: 50px;
  overflow: hidden;
  font-size: 1.5rem;
  cursor: pointer;
  svg {
  }
  &:hover {
    background-color: #d6d1d1;
    svg {
      animation: rotateAnimation 0.4s;
    }
    img {
      animation: rotateAnimation 0.4s;
    }
  }

  @media (max-width: 700px) {
    width: 32px;

    font-size: 1rem;
  }
  @keyframes rotateAnimation {
    0% {
      transform: rotate(-12deg);
    }
    50% {
      transform: rotate(-25deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

const Img = styled.img`
  width: 100%;
  @media (max-width: 700px) {
    border-radius: 999px;
  }
`;

const LogOutBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 97%;
  height: 42px;
  background-color: #fff;
  color: #bd1818;
  font-size: 1.5rem;
  cursor: pointer;
  @media (max-width: 700px) {
    width: 42px;
    height: 42px;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { setIsShow } = useModalContext();
  const { onLogOut } = useAuthContext();
  const onClickLogout = () => {
    onLogOut();
    toast.success("로그아웃 되었습니다.");
    navigate("/login");
  };
  const showModal = () => {
    setIsShow(true);
  };
  const {
    notifiQuery: { data, isLoading },
  } = useNotification();
  return (
    <Nav>
      <Menu>
        <Link to="/">
          <Item>
            <BiSolidHome />
          </Item>
        </Link>
        <Item onClick={showModal}>
          <BsPencil />
        </Item>
        <Link to="/search">
          <Item>
            <LiaSearchSolid />
          </Item>
        </Link>
        <Link to="/notification">
          <Item>
            <IoIosNotificationsOutline />
            {!isLoading && data?.filter((noti) => !noti.isRead).length > 0 && (
              <NotificationCnt data={data} />
            )}
          </Item>
        </Link>
        <Link to="/profile">
          <Item>
            <BiUserCircle />
          </Item>
        </Link>
      </Menu>
      <LogOutBtn onClick={onClickLogout}>
        <BiLogOut />
      </LogOutBtn>
    </Nav>
  );
};

export default Navbar;
