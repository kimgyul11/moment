import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 250px;
  border: 1px solid #e0e0e0;
  margin: 10px auto;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const Header = styled.div`
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 5px;
  position: relative;
  text-align: center;
  img {
    width: 35px;
    border-radius: 50%;
  }
`;
const CreatedAt = styled.p`
  position: absolute;
  right: 15px;
  top: 30px;
  font-size: 0.7rem;
`;
const Body = styled.div`
  display: flex;
  padding: 6px 12px;
  flex: 1;
`;

const Content = styled.div`
  width: 80%;
  padding: 12px;
  font-size: 0.8rem;
`;
const Img = styled.img`
  width: 120px;
  height: 120px;
  background-color: #e0e0e0;
`;

const Footer = styled.div`
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column;
    height: 70px;
  }
`;
const HashTagWrap = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  height: 30px;
  overflow: auto;
`;

const HasTag = styled.p`
  background-color: #85d6d3;
  color: #fff;
  font-weight: 700;
  padding: 6px;
  margin: 0px 2px;
  border-radius: 999px;
  font-size: 0.7rem;
  cursor: pointer;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 50%;
  height: 30px;
  button {
    margin-right: 2px;
    width: 50px;
    border: none;
    padding: 6px;
    border-radius: 999px;
    background: #e0e0e0;
    cursor: pointer;
    &:hover {
      background-color: #e0e0e0;
    }
  }
`;
const MomentBox = ({
  text,
  createdAt,
  userId,
  id,
  userPhoto,
  username,
  photo,
  hashTag,
}) => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  return (
    <Box>
      <Header>
        <img src={userPhoto} alt="프로필화면" />
        <p>{username}</p>
        <CreatedAt>
          {dayjs(createdAt).format("YYYY년 MM월 DD일 HH:mm")}
        </CreatedAt>
      </Header>
      <Body>
        {photo && <Img src={photo} />}
        <Content>{text}</Content>
      </Body>
      <Footer>
        <HashTagWrap>
          {hashTag.length > 0 &&
            hashTag.map((tag, idx) => (
              <HasTag
                key={idx}
                onClick={() => {
                  navigate(`/search/${tag}`);
                }}
              >{`# ${tag}`}</HasTag>
            ))}
        </HashTagWrap>
        <ButtonWrap>
          {user.uid === userId && (
            <>
              <button>삭제</button>
              <button>수정</button>
            </>
          )}
          <button>좋아요</button>
          <button>저장</button>
        </ButtonWrap>
      </Footer>
    </Box>
  );
};

export default MomentBox;
