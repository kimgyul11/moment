import { auth } from "../utils/firebase";

const Home = () => {
  const user = auth.currentUser;
  console.log(user);
  return <div>홈화면</div>;
};

export default Home;
