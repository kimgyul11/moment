import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
const Box = styled.div`
  width: 50%;
  height: 200px;
  margin: auto;
`;

const Header = styled.div`
  width: 100%;
  background-color: red;
  display: flex;
  align-items: center;
  text-align: center;

  img {
    width: 40px;
    border-radius: 50%;
  }
`;
const Body = styled.div``;
const Img = styled.img`
  width: 150px;
  height: 150px;
`;
const MomentBox = ({
  text,
  createdAt,
  userId,
  id,
  userPhoto,
  username,
  photo,
}) => {
  return (
    <Box>
      <Header>
        <img src={userPhoto} alt="프로필화면" />
        <p>{username}</p>
        <p>{dayjs(createdAt).format("YYYY년 MM월 DD일 HH:mm")}</p>
      </Header>
      <Body>{text}</Body>
      {photo && <Img src={photo} />}
    </Box>
  );
};

export default MomentBox;
