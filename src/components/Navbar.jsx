import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../utils/firebase";
import { useModalContext } from "../context/ModalContext";
import { BsPencil } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { BiUserCircle, BiLogOut } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LiaSearchSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
const Nav = styled.div`
  min-width: 60px;
  max-width: 60px;
  background-color: #212121fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 700px) {
    width: 100%;
    max-width: 100%;
    height: 90px;
    flex-direction: row;
  }
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 700px) {
    flex-direction: row;
    align-items: center;
    height: 60px;
  }
`;
const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 42px;
  height: 42px;
  margin: 12px 0px;
  border-radius: 50%;
  overflow: hidden;
  font-size: 1.5rem;

  cursor: pointer;

  &:hover {
    background-color: #d6d1d1;
    animation: rotateAnimation 0.4s;
    /* transform: rotate(-25deg); */
  }
  @media (max-width: 700px) {
    width: 42px;
    height: 42px;
    margin: 2px 6px;
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
`;
const Navbar = () => {
  const navigate = useNavigate();
  const { setIsShow } = useModalContext();
  const { user } = useAuthContext();
  const [userPhotoURL, setUserPhotoURL] = useState(user.photoURL);
  useEffect(() => {
    setUserPhotoURL(user.photoURL);
  }, [user.photoURL]);

  const onLogOut = async () => {
    const ok = confirm("정말 로그아웃 하실건가요?");
    if (ok) {
      await auth.signOut();
      toast.success("로그아웃 되었습니다.");
      navigate("/login");
    }
  };
  const showModal = () => {
    setIsShow(true);
  };

  return (
    <Nav>
      <Menu>
        <Link to="/">
          <Item>
            <AiOutlineHome />
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
          </Item>
        </Link>
        <Link to="/profile">
          <Item>
            {userPhotoURL ? <Img src={userPhotoURL} /> : <BiUserCircle />}
          </Item>
        </Link>
      </Menu>
      <Item onClick={onLogOut}>
        <BiLogOut />
      </Item>
    </Nav>
  );
};

export default Navbar;
