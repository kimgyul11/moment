import styled from "styled-components";
import BestMoment from "../components/BestMoment";
import { auth } from "../utils/firebase";
import Moment from "../components/Moment";

import { useModalContext } from "../context/ModalContext";

const Wrap = styled.div`
  width: 0%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 14px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;
const Title = styled.p`
  margin: 20px 0px;
  font-size: 1.5rem;
`;
const Home = () => {
  const user = auth.currentUser;
  console.log(user);
  return (
    <Wrap>
      <Title>Best Moment👑</Title>
      <BestMoment />
      <Title>실시간 모멘트📸</Title>
      <Moment />
    </Wrap>
  );
};

export default Home;
