import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import { BiSolidLike, BiLike, BiCommentDetail } from "react-icons/bi";

import { auth, db, storage } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";
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
  cursor: pointer;
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 2px;
    width: 50px;
    border: none;
    padding: 6px;
    border-radius: 999px;
    border: 1px solid #e0e0e0;
    font-weight: 700;
    cursor: pointer;
    &:hover {
      background-color: #e0e0e0;
    }
    &:nth-child(1) {
      border: 1px solid #cf1919dc;
      color: #cf1919dc;
      background: #fff;
      &:hover {
        background-color: #cf1919dc;
        color: #fff;
      }
    }
    &:nth-child(2) {
      border: 1px solid #262d73;
      background-color: #fff;
      color: #262d73;
      &:hover {
        background-color: #1d225b;
        color: #fff;
      }
    }
  }
`;

const SmallButton = styled.button``;
const MomentBox = ({ moment }) => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  //삭제 핸들러
  const onClickDelete = async () => {
    const imageRef = ref(
      storage,
      `moment/${moment.userId}/${moment.id}-${moment.username}`
    );
    let ok = window.confirm("정말 게시글을 삭제하실건가요?");
    if (ok) {
      //이미지가 있을경우 이미지를 삭제
      if (moment.photo) {
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }
      await deleteDoc(doc(db, "moment", moment.id));
      toast.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };
  //좋아요 버튼 핸들러
  const onClickLike = async () => {
    const momentRef = doc(db, "moment", moment.id);
    //1.like필드에 현재 로그인한 유저가 존재한다면 삭제.
    if (user.uid && moment.likes && moment.likes.includes(user.uid)) {
      await updateDoc(momentRef, {
        likes: arrayRemove(user.uid),
        likeCount: moment.likeCount ? moment.likeCount - 1 : 0,
      });
    } else {
      //2.like필드에 로그인한 유저가 없다면 추가
      await updateDoc(momentRef, {
        likes: arrayUnion(user.uid),
        likeCount: moment.likeCount ? moment.likeCount + 1 : 1,
      });
    }
  };

  return (
    <Box>
      <Header>
        <img src={moment.userPhoto} alt="profile" />
        <p>{moment.username}</p>
        <CreatedAt>
          {dayjs(moment.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
        </CreatedAt>
      </Header>

      <Body
        onClick={() => {
          navigate(`/moment/${moment.id}`);
        }}
      >
        {moment.photo && <Img src={moment.photo} />}
        <Content>{moment.text}</Content>
      </Body>

      <Footer>
        <HashTagWrap>
          {moment.hashTag.length > 0 &&
            moment.hashTag.map((tag, idx) => (
              <HasTag
                key={idx}
                onClick={() => {
                  navigate(`/search/${tag}`);
                }}
              >{`# ${tag}`}</HasTag>
            ))}
        </HashTagWrap>
        <ButtonWrap>
          {user.uid === moment.userId && (
            <>
              <button onClick={onClickDelete}>삭제</button>
              <button>수정</button>
            </>
          )}
          <button onClick={onClickLike}>
            {moment.likes && moment.likes.includes(user.uid) ? (
              <BiSolidLike />
            ) : (
              <BiLike />
            )}
            {moment.likeCount || 0}
          </button>

          <button>
            <BiCommentDetail />
            {(moment.comments && moment.comments.length) || 0}
          </button>
        </ButtonWrap>
      </Footer>
    </Box>
  );
};

export default MomentBox;
