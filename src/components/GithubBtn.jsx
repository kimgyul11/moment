import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../utils/firebase";
import { Container, Logo } from "../assets/styled_component/social-btn";

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
