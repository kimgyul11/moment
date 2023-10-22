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
    <Container onClick={onclick} initial={{ scale: 0 }} animate={{ scale: 1 }}>
      <Logo
        src="/github-log.svg"
        initial={{ rotate: 35, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <p>GitHub로 로그인</p>
    </Container>
  );
};

export default GithubBtn;
