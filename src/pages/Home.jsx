import styled from "styled-components";
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
  return (
    <Wrap>
      <Moment />
    </Wrap>
  );
};

export default Home;
