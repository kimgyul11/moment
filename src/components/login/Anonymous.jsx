import { signInAnonymously } from "firebase/auth";

import { toast } from "react-toastify";
import { Container, Logo } from "../../assets/styled_component/social-btn";

import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";

const Anonymous = () => {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const credential = await signInAnonymously(auth);
      toast.success("로그인 성공!");
      navigate("/");
      console.log(credential);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Logo
        src="/anonymous.png"
        initial={{ rotate: 35, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      />
      <p>익명으로 로그인</p>
    </Container>
  );
};

export default Anonymous;
