import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../../utils/firebase";
import { url } from "../../components/MomentBox";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
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
`;

const Profile = () => {
  const [likeMoment, setLikeMoment] = useState([]);
  const [myMoments, setMyMoments] = useState([]);
  const [followingMoments, setFollowingMoments] = useState([]);
  const [followingIds, setFollowingIds] = useState([""]);
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user.displayName || "사용자");
  const [userPhoto, setUserPhoto] = useState(user.photoURL);
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [activeTab, setActiveTab] = useState("like");
  const [isEdit, setIsEdit] = useState(false);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const onChangeAvatar = async (e) => {
    const { files } = e.target;
    if (user && files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setUserPhoto(avatarUrl);
      await updateProfile(user, { photoURL: userPhoto });
      Promise.all(
        myMoments.map(async (mo) => {
          const ref = doc(db, "moment", mo.id);
          await updateDoc(ref, { userPhoto: user.photoURL });
          return mo; // 현재 요소를 그대로 반환
        })
      )
        .then((updatedMoments) => {
          setMyMoments(updatedMoments);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    console.log(user.photoURL);
  };

  //유저이름 변경,게시글 이름도 모두 변경
  const onSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await updateProfile(user, {
        displayName: newDisplayName,
      });
      setDisplayName(newDisplayName);
      setIsEdit(false);
      Promise.all(
        myMoments.map(async (mo) => {
          const ref = doc(db, "moment", mo.id);
          await updateDoc(ref, { username: newDisplayName });
          return mo; // 현재 요소를 그대로 반환
        })
      )
        .then((updatedMoments) => {
          setMyMoments(updatedMoments);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //팔로잉하는 유저 가져오기
  const getFollowingIds = useCallback(() => {
    if (user.uid) {
      const ref = doc(db, "following", user.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIds([""]);
        doc
          .data()
          .users.map((user) =>
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
            <img src={userPhoto ? userPhoto : url} />
            <p>{displayName}</p>
            <button>프로필 수정하기</button>
          </ProfileInfo>
          <Title>내가 기록한 순간들✨</Title>
          <ProfileMoment>
            {myMoments.map((moment) => (
              <ProfileMomentBox moment={moment} key={moment.id} />
            ))}
          </ProfileMoment>
        </LeftInfo>
        {/* 내가 작성한 게시글 보기 */}
        <RightInfo>
          <Tab>
            <p
              className={activeTab === "like" && classes.active}
              onClick={() => setActiveTab("like")}
            >
              좋아요한 게시글
            </p>
            <p
              className={activeTab === "following" && classes.active}
              onClick={() => setActiveTab("following")}
            >
              팔로우 게시글
            </p>
          </Tab>
          <MomentWrap>
            {activeTab === "like" && (
              <>
                {likeMoment.map((moment) => (
                  <ProfileMomentBox moment={moment} key={moment.id} />
                ))}
              </>
            )}
            {activeTab === "following" && (
              <>
                {followingMoments.map((moment) => (
                  <ProfileMomentBox moment={moment} key={moment.id} />
                ))}
              </>
            )}
          </MomentWrap>
        </RightInfo>
      </ProfileWrap>
    </Wrap>
  );
};

export default Profile;
