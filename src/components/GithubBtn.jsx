import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../utils/firebase";
import { Container } from "../assets/styled_component/social-btn";

const Button = styled.span`
  background-color: white;
  border: 1px solid #e0e0e0;
  width: 50px;
  height: 50px;

  font-weight: 500;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
  cursor: pointer;
`;
const Logo = styled.img`
  height: 25px;
`;

const GithubBtn = () => {
  const navigate = useNavigate();
  const onClick = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container onClick={onClick}>
      <Logo src="/github-log.svg" />
      <p>GitHub로 로그인</p>
    </Container>
  );
};

export default GithubBtn;
