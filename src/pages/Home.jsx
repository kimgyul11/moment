import styled from "styled-components";
import BestMoment from "../components/BestMoment";
import { auth } from "../utils/firebase";
import Moment from "../components/Moment";

const Wrap = styled.div`
  width: 0%;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    width: 100%;
    padding: 12px;
  }
`;

const Home = () => {
  const user = auth.currentUser;
  console.log(user);
  return (
    <Wrap>
      {/* <BestMoment /> */}

      <Moment />
    </Wrap>
  );
};

export default Home;
