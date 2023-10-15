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

const Wrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProfileWrap = styled.div`
  width: 80%;
  height: 80vh;
  background: beige;
`;
const LeftInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;

  background-color: #b9b9a9;
`;
const Img = styled.img`
  width: 150px;
  border-radius: 999px;
  cursor: pointer;
`;
const Info = styled.div``;
const ProfileInfo = styled.div`
  input {
    display: none;
  }
`;
const Profile = () => {
  const [likeMoment, setLikeMoment] = useState([]);
  const [myMoments, setMyMoments] = useState([]);
  const user = auth.currentUser;
  console.log(likeMoment, myMoments);

  const [displayName, setDisplayName] = useState(user.displayName || "사용자");
  const [userPhoto, setUserPhoto] = useState(user.photoURL);
  const [newDisplayName, setNewDisplayName] = useState(displayName);
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

  //게시글 가져오기
  useEffect(() => {
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

      onSnapshot(myMomentQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyMoments(dataObj);
      });
      onSnapshot(likeMomentQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikeMoment(dataObj);
      });
    }
  }, [user]);

  return (
    <Wrap>
      <ProfileWrap>
        <LeftInfo>
          <ProfileInfo>
            <Img src={userPhoto ? userPhoto : url} />
            <label htmlFor="avatar">프로필 이미지 변경</label>
            <input
              onChange={onChangeAvatar}
              id="avatar"
              type="file"
              accept="image/*"
            />
          </ProfileInfo>
          <Info>
            <form onSubmit={onSubmit}>
              {!isEdit && <span>{displayName}</span>}
              {isEdit && <input value={newDisplayName} onChange={onChange} />}
              <span onClick={() => setIsEdit((prev) => !prev)}>
                {isEdit ? "취소" : "닉네임 수정"}
              </span>
              {isEdit && <button>저장</button>}
            </form>
          </Info>
        </LeftInfo>
        {/* 내가 작성한 게시글 보기 */}
      </ProfileWrap>
    </Wrap>
  );
};

export default Profile;
