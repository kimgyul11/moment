import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import { GoPersonAdd } from "react-icons/go";
import { BsFillPersonCheckFill } from "react-icons/bs";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Button = styled.button`
  position: absolute;
  left: 170px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: #2953a7;
  color: #fff;
  border-radius: 999px;
  padding: 4px;
  cursor: pointer;
  margin-left: auto;
  svg {
    margin-left: 5px;
  }
`;
const Text = styled.span`
  font-size: 0.7rem;
`;

export default function FollowingButton({ moment }) {
  const [momentFollowers, setMomentFollowers] = useState([]);
  const user = auth.currentUser;

  //팔로잉 이벤트
  const onClickFollow = async (e) => {
    e.preventDefault();
    try {
      if (user.uid) {
        //팔로잉 : 로그인한 유저를 기준으로 팔로잉한 유저를 넣는다.
        const followingRef = doc(db, "following", user.uid);
        await setDoc(
          followingRef,
          { users: arrayUnion({ id: moment.userId }) },
          { merge: true }
        );

        //팔로워 : 게시글의 작성자 기준으로 팔로우하고있는 유저를 넣는다.
        const followerRef = doc(db, "follower", moment.userId);
        await setDoc(
          followerRef,
          {
            users: arrayUnion({ id: user.uid }),
          },
          { merge: true }
        );

        //팔로잉 알림 생성
        if (user.uid !== moment.userId) {
          await addDoc(collection(db, "notifications"), {
            createdAt: Date.now(),
            content: `${
              user.displayName || user.email
            }님이 당신을 팔로우 했습니다.`,
            url: "#",
            isRead: false,
            userId: moment.userId,
          });
        }
        toast.success("팔로우 완료");
      }
    } catch (e) {
      console.log(e);
    }
  };
  //팔로잉 취소 이벤트
  const onClickDeleteFollow = async (e) => {
    e.preventDefault();
    try {
      if (user.uid) {
        const followingRef = doc(db, "following", user.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: moment.userId }),
        });
        const followerRef = doc(db, "follower", moment.userId);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user.uid }),
        });
        toast.success("팔로우 취소");
      }
    } catch (e) {
      console.log(e);
    }
  };
  //게시글의 작성자 팔로잉한 유저 가져오기
  const getFollowers = useCallback(async () => {
    if (moment.userId) {
      const ref = doc(db, "follower", moment.userId);
      onSnapshot(ref, (doc) => {
        setMomentFollowers([]);
        doc
          ?.data()
          ?.users?.map((user) =>
            setMomentFollowers((prev) => (prev ? [...prev, user?.id] : []))
          );
      });
    }
  }, [moment.userId]);
  useEffect(() => {
    getFollowers();
  }, [getFollowers, moment.userId]);

  return (
    <>
      {user.uid !== moment.userId && momentFollowers.includes(user.uid) ? (
        <Button onClick={onClickDeleteFollow}>
          <Text>팔로잉 중..</Text>
          <BsFillPersonCheckFill />
        </Button>
      ) : (
        <Button onClick={onClickFollow}>
          <Text>팔로우</Text>
          <GoPersonAdd />
        </Button>
      )}
    </>
  );
}
