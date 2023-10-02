import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { Container, Logo } from "../assets/styled_component/social-btn";

const GoogleBtn = () => {
  const navigate = useNavigate();
  const onclick = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Container onClick={onclick}>
      <Logo src="/google-log.svg" />
      <p>Google로 로그인</p>
    </Container>
  );
};

export default GoogleBtn;
