import styled from "styled-components";
import BestMoment from "../components/BestMoment";
import { auth } from "../utils/firebase";
const Wrap = styled.div`
  width: 0%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;
const Title = styled.p`
  margin: 16px 0px;
  font-size: 2rem;
`;
const Home = () => {
  const user = auth.currentUser;
  console.log(user);
  return (
    <Wrap>
      <Title>Best Moment</Title>
      <BestMoment />
    </Wrap>
  );
};

export default Home;
