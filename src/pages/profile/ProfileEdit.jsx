import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { ImCancelCircle } from "react-icons/im";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProfileWrap = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 15px;

  @media (max-width: 800px) {
    flex-direction: column;
    width: 100%;
  }
`;

const AvatarUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  width: 100px;
  height: 100px;
  overflow: hidden;
`;
const UserPhoto = styled.img`
  width: 100%;

  cursor: pointer;
`;
const AvatarInput = styled.input`
  display: none;
`;
const ImgAtt = styled.label`
  margin-top: 12px;
  cursor: pointer;
  border: 1px solid #85d6d3;
  padding: 6px;
  border-radius: 15px;
  color: #85d6d3;
  font-size: 0.8rem;
`;

const NickEditForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const NicknameInput = styled.input`
  margin-top: 40px;
  width: 150px;
  height: 30px;
  padding: 12px;
  text-align: center;
  font-weight: 700;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 12px;
  outline: none;
`;
const Cancel = styled.p`
  position: absolute;
  top: 15px;
  right: 15px;
  color: #ae3030;
  font-size: 1.5rem;

  cursor: pointer;
`;

const SubmitBtn = styled.input`
  width: 50px;
  margin: auto;
  cursor: pointer;
  border-radius: 999px;
  border: 1px solid #85d6d3;
  background: #fff;
  color: #85d6d3;
  font-weight: 600;
  padding: 6px;
`;
const ProfileEdit = () => {
  const user = auth.currentUser;
  const [myMoments, setMyMoments] = useState([]);
  const [displayName, setDisplayName] = useState(user.displayName || "사용자");
  const [userPhoto, setUserPhoto] = useState(user.photoURL);
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  //이미지 변경
  const onChangeAvatar = async (e) => {
    const { files } = e.target;
    if (user && files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setUserPhoto(avatarUrl);
      await updateProfile(user, { photoURL: userPhoto });
      toast.success("프로필 변경이 완료되었습니다!");
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
    setIsSubmiting(true);
    e.preventDefault();
    if (user) {
      await updateProfile(user, {
        displayName: newDisplayName,
      });
      setDisplayName(newDisplayName);
      //게시글 수정
      Promise.all(
        myMoments.map(async (mo) => {
          const ref = doc(db, "moment", mo.id);
          await updateDoc(ref, { username: newDisplayName });
          return mo; // 현재 요소를 그대로 반환
        })
      )
        .then((updatedMoments) => {
          setMyMoments(updatedMoments);
          toast.success("프로필이 업데이트 되었습니다.");
          navigate("/profile");
          setIsSubmiting(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //게시글 가져오기
  useEffect(() => {
    let myUnsubscribe;

    if (user) {
      let momentRef = collection(db, "moment");
      const myMomentQuery = query(
        momentRef,
        where("username", "==", user.displayName),
        orderBy("createdAt", "desc")
      );
      myUnsubscribe = onSnapshot(myMomentQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyMoments(dataObj);
      });
    }

    return () => {
      myUnsubscribe && myUnsubscribe();
    };
  }, [user]);
  console.log(myMoments);
  return (
    <Wrap>
      <ProfileWrap
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AvatarUpload htmlFor="avatar">
          {userPhoto ? (
            <UserPhoto src={userPhoto} />
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
        </AvatarUpload>
        <ImgAtt htmlFor="avatar">프로필 변경</ImgAtt>
        <AvatarInput
          type="file"
          id="avatar"
          accept="image/*"
          onChange={onChangeAvatar}
        />
        <NickEditForm onSubmit={onSubmit}>
          <NicknameInput value={newDisplayName} onChange={onChange} />
          <SubmitBtn type="submit" disabled={isSubmiting} value="수정" />
        </NickEditForm>
        <Cancel onClick={() => navigate(-1)}>
          <ImCancelCircle />
        </Cancel>
      </ProfileWrap>
    </Wrap>
  );
};

export default ProfileEdit;
