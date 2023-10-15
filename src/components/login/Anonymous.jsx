import { signInAnonymously } from "firebase/auth";

import { toast } from "react-toastify";
import { Container, Logo } from "../../assets/styled_component/social-btn";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";

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
    <Container onClick={onClick}>
      <Logo src="/anonymous.png" />
      <p>익명으로 로그인</p>
    </Container>
  );
};

export default Anonymous;
