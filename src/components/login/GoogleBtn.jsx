import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { Container, Logo } from "../../assets/styled_component/social-btn";
import { auth } from "../../utils/firebase";

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
    <Container
      onClick={onclick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Logo
        initial={{ rotate: 35, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        src="/google-log.svg"
      />
      <p>Google로 로그인</p>
    </Container>
  );
};

export default GoogleBtn;
