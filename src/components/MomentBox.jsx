import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import { BiSolidLike, BiLike, BiCommentDetail } from "react-icons/bi";

import { auth, db, storage } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";
import FollowingButton from "./following/FollowingButton";
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
`;

const Profile = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid #e0e0e0;
  }
  p {
    margin-left: 5px;
    font-size: 0.8rem;
    font-weight: bold;
  }
`;
const CreatedAt = styled.p`
  position: absolute;
  right: 15px;
  top: 30px;
  font-size: 0.7rem;
  color: #888888;
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
    border: none;
    font-size: 0.8rem;
    width: 50px;
    height: 25px;
    background-color: #bfbfbf;
    border-radius: 999px;
    margin: 0px 4px;
    font-weight: 700;
    cursor: pointer;
    svg {
      margin-right: 2px;
    }
  }
`;
const EditBtnWrap = styled.div`
  display: flex;
  @media (max-width: 800px) {
  }
  button {
    &:nth-child(1) {
      color: #fff;
      background: #cf1919dc;
      &:hover {
        background-color: #971717dc;
        color: #fff;
      }
    }
    &:nth-child(2) {
      background-color: #262c6f;
      color: #fff;
      &:hover {
        background-color: #05081e;
        color: #fff;
      }
    }
  }
`;

const ServiceBtnWrap = styled.div`
  display: flex;
  button {
    &:nth-child(1) {
      border: 1px solid #ec6060;
      background-color: #fff;
      color: #ec6060;
    }
    &:nth-child(2) {
      border: 1px solid #2e2c2c;
      background-color: #fff;
      color: #2e2c2c;
    }
  }
`;
export const url =
  "https://e7.pngegg.com/pngimages/906/222/png-clipart-computer-icons-user-profile-avatar-french-people-computer-network-heroes-thumbnail.png";

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
      if (user.uid !== moment.userId) {
        await addDoc(collection(db, "notifications"), {
          createdAt: Date.now(),
          content: `${
            user.displayName || user.email || "익명의 사용자"
          }님이 게시글에 좋아요를 눌렀습니다.`,
          url: `/moment/${moment.id}`,
          isRead: false,
          userId: moment.userId,
        });
      }
    } else {
      //2.like필드에 좋아요한 유저가 없다면 추가
      await updateDoc(momentRef, {
        likes: arrayUnion(user.uid),
        likeCount: moment.likeCount ? moment.likeCount + 1 : 1,
      });
    }
  };

  return (
    <Box>
      <Header>
        <Profile>
          <img src={moment.userPhoto ? moment.userPhoto : url} alt="profile" />
          <p>{moment.username}</p>
          {user.uid !== moment.userId && <FollowingButton moment={moment} />}
        </Profile>
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
            <EditBtnWrap>
              <button onClick={onClickDelete}>삭제</button>
              <button onClick={() => navigate(`/moment/edit/${moment.id}`)}>
                수정
              </button>
            </EditBtnWrap>
          )}
          <ServiceBtnWrap>
            <button onClick={onClickLike}>
              {moment.likes && moment.likes.includes(user.uid) ? (
                <BiSolidLike />
              ) : (
                <BiLike />
              )}
              {moment.likeCount || 0}
            </button>

            <button onClick={() => navigate(`/moment/${moment.id}`)}>
              <BiCommentDetail />
              {(moment.comment && moment.comment.length) || 0}
            </button>
          </ServiceBtnWrap>
        </ButtonWrap>
      </Footer>
    </Box>
  );
};

export default MomentBox;
