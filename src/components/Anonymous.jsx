import { signInAnonymously } from "firebase/auth";
import { Container, Logo } from "../assets/styled_component/social-btn";
import { auth } from "../utils/firebase";

const Anonymous = () => {
  const onClick = async () => {
    try {
      const credential = await signInAnonymously(auth);
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
