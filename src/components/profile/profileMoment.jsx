import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Box = styled.div`
  width: 100%;
  height: 65px;
  padding: 6px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    background: #e0e0e0;
    border-radius: 5px;
  }
`;
const Header = styled.div`
  width: 100%;
  justify-content: space-between;
  display: flex;
  p {
    color: #888888;
    font-size: 0.7rem;
    margin-left: 4px;
  }
`;

const Profile = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    border: 1px solid #e0e0e0;
  }
`;

const Content = styled.p`
  flex: 1;
  padding: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default function ProfileMomentBox({ moment }) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/moment/${moment.id}`);
  };
  return (
    <Box onClick={onClick}>
      <Header>
        <Profile>
          <img src={moment.userPhoto ? moment.userPhoto : "profile.png"} />
          <p>{moment.username}</p>
        </Profile>
        <p>{dayjs(moment.createdAt).format("YYYY년 MM월 DD일 HH:mm")}</p>
      </Header>
      <Content>{moment.text}</Content>
    </Box>
  );
}
