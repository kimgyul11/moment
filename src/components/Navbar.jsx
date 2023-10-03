import { Link } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../utils/firebase";

const Nav = styled.div`
  min-width: 80px;
  max-width: 80px;
  background-color: #85d6d3;
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
  background-color: #fff;
  margin: 15px;
  border-radius: 50%;
  cursor: pointer;
`;

const Img = styled.img`
  height: 35px;
`;
const Navbar = () => {
  const user = auth.currentUser;
  return (
    <Nav>
      <Menu>
        <Link to="/">
          <Item>HOME</Item>
        </Link>
        <Link to="/profile">
          <Item>
            {user.photoURL ? (
              <Img src={user.photoURL} />
            ) : (
              <Img src="/navProfile.png" />
            )}
          </Item>
        </Link>
        <Item>글쓰기</Item>
      </Menu>
      <Item>로그아웃</Item>
    </Nav>
  );
};

export default Navbar;
