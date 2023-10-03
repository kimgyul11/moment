import styled from "styled-components";

const Nav = styled.div`
  min-width: 80px;
  max-width: 80px;
  border-right: 2px solid #e0e0e0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 700px) {
    width: 100%;
    max-width: 100%;
    height: 90px;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
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
  border: 1px solid #e0e0e0;
  margin: 15px;
  border-radius: 50%;
  cursor: pointer;
`;
const Navbar = () => {
  return (
    <Nav>
      <Menu>
        <Item>홈화면</Item>
        <Item>프로필</Item>
        <Item>글쓰기</Item>
      </Menu>
      <Item>로그아웃</Item>
    </Nav>
  );
};

export default Navbar;
