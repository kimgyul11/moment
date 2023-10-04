import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../utils/firebase";
import { useModalContext } from "../context/ModalContext";

const Nav = styled.div`
  min-width: 80px;
  max-width: 80px;
  background-color: #e0e0e0;
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
  }
`;
const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin: 15px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  @media (max-width: 700px) {
    width: 35px;
  }
`;

const Img = styled.img`
  width: 100%;
`;
const Navbar = () => {
  const navigate = useNavigate();
  const { setIsShow } = useModalContext();
  const onLogOut = async () => {
    const ok = confirm("정말 로그아웃 하실건가요?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };
  const showModal = () => {
    setIsShow(true);
  };
  const user = auth.currentUser;
  return (
    <Nav>
      <Menu>
        <Link to="/">
          <Item>
            <Img src="home-button.png" />
          </Item>
        </Link>
        <Link to="/profile">
          <Item>
            {user.photoURL ? (
              <Img src={user.photoURL} />
            ) : (
              <Img src="/profile2.png" />
            )}
          </Item>
        </Link>
        <Item onClick={showModal}>
          <Img src="/pencil.png" />
        </Item>
      </Menu>
      <Item onClick={onLogOut}>
        <Img src="/logout.png" />
      </Item>
    </Nav>
  );
};

export default Navbar;
