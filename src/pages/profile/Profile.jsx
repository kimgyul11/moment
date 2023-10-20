import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../../utils/firebase";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import ProfileMomentBox from "../../components/profile/profileMoment";
import classes from "../profile/Profile.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProfileWrap = styled.div`
  display: flex;
  width: 80%;
  height: 80vh;
  @media (max-width: 800px) {
    flex-direction: column;
    width: 100%;
  }
`;
const LeftInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  height: 100%;
  padding: 12px;
  @media (max-width: 800px) {
    width: 100%;
  }
`;
const ProfileInfo = styled.div`
  text-align: center;
  margin-top: 30px;
  height: 200px;

  img {
    border: 1px solid #e0e0e0;
    width: 100px;
    height: 100px;
    border-radius: 999px;
  }
  p {
    margin-top: 10px;
    font-size: 1.5rem;
    font-weight: 700;
  }
  button {
    margin-top: 6px;
    padding: 6px;
    border-radius: 999px;
    border: 1px solid #66b7d7;
    color: #66b7d7;
    background: #fff;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: #66b7d7;
      color: #fff;
    }
  }
`;
const ProfileMoment = styled.div`
  flex: 1;
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.h3`
  width: 100%;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

const RightInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 50%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  height: 50px;

  p {
    width: 150px;
    height: 30px;
    margin: 12px;
    border-radius: 999px;
    border: 1px solid #e0e0e0;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;
const MomentWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  border: 1px solid #e0e0e0;
  padding: 12px;
`;
const EmptyComment = styled.p`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
`;
const Profile = () => {
  const [likeMoment, setLikeMoment] = useState([]);
  const [myMoments, setMyMoments] = useState([]);
  const [followingMoments, setFollowingMoments] = useState([]);
  const [followingIds, setFollowingIds] = useState([""]);
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user.displayName || "사용자");
  const [userPhoto, setUserPhoto] = useState(user.photoURL);
  const [activeTab, setActiveTab] = useState("like");
  const navigate = useNavigate();

  //팔로잉하는 유저 가져오기
  const getFollowingIds = useCallback(() => {
    if (user.uid) {
      const ref = doc(db, "following", user.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIds([""]);
        doc
          .data()
          .users?.map((user) =>
            setFollowingIds((prev) => (prev ? [...prev, user.id] : []))
          );
      });
    }
  }, [user.uid]);
  useEffect(() => {
    getFollowingIds();
  }, [getFollowingIds]);

  //게시글 가져오기
  useEffect(() => {
    let myUnsubscribe;
    let likeUnsubscribe;
    let followingUnsubscribe;
    if (user) {
      let momentRef = collection(db, "moment");
      const myMomentQuery = query(
        momentRef,
        where("username", "==", user.displayName),
        orderBy("createdAt", "desc")
      );
      const likeMomentQuery = query(
        momentRef,
        where("likes", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );
      const followingMomentQuery = query(
        momentRef,
        where("userId", "in", followingIds),
        orderBy("createdAt", "desc")
      );

      myUnsubscribe = onSnapshot(myMomentQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyMoments(dataObj);
      });
      likeUnsubscribe = onSnapshot(likeMomentQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikeMoment(dataObj);
      });

      followingUnsubscribe = onSnapshot(followingMomentQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setFollowingMoments(dataObj);
      });
    }
    return () => {
      myUnsubscribe && myUnsubscribe();
      likeUnsubscribe && likeUnsubscribe();
      followingUnsubscribe && followingUnsubscribe();
    };
  }, [user, activeTab]);

  return (
    <Wrap>
      <ProfileWrap>
        <LeftInfo>
          <ProfileInfo>
            {userPhoto ? (
              <img src={userPhoto} />
            ) : (
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            )}

            <p>{displayName}</p>
            <button onClick={() => navigate("/profile/edit")}>
              프로필 수정하기
            </button>
          </ProfileInfo>
          <Title>내가 기록한 순간들✨</Title>
          <ProfileMoment>
            {myMoments.length > 0 ? (
              myMoments.map((moment) => (
                <ProfileMomentBox moment={moment} key={moment.id} />
              ))
            ) : (
              <EmptyComment>아직 기록한 순간이 없습니다!</EmptyComment>
            )}
          </ProfileMoment>
        </LeftInfo>
        {/* 내가 작성한 게시글 보기 */}
        <RightInfo>
          <Tab>
            <p
              className={activeTab === "like" ? classes.active : ""}
              onClick={() => setActiveTab("like")}
            >
              좋아요한 모멘트
            </p>
            <p
              className={activeTab === "following" ? classes.active : ""}
              onClick={() => setActiveTab("following")}
            >
              친구의 모멘트
            </p>
          </Tab>
          <MomentWrap>
            {activeTab === "like" && (
              <>
                {likeMoment.length > 0 ? (
                  likeMoment.map((moment) => (
                    <ProfileMomentBox moment={moment} key={moment.id} />
                  ))
                ) : (
                  <EmptyComment>아직 좋아요한 모멘트가 없습니다!</EmptyComment>
                )}
              </>
            )}
            {activeTab === "following" && (
              <>
                {followingMoments.length > 0 ? (
                  followingMoments.map((moment) => (
                    <ProfileMomentBox moment={moment} key={moment.id} />
                  ))
                ) : (
                  <EmptyComment>아직 모멘트가 없습니다!</EmptyComment>
                )}
              </>
            )}
          </MomentWrap>
        </RightInfo>
      </ProfileWrap>
    </Wrap>
  );
};

export default Profile;
