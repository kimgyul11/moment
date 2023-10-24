import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileMomentBox from "./profileMoment";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { db } from "../../utils/firebase";

const MyMomentsWrap = styled.div`
  flex: 1;
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const EmptyComment = styled.p`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
`;

const MyMoments = () => {
  const [myMoments, setMyMoments] = useState([]);
  const { user } = useAuthContext();
  useEffect(() => {
    let myUnsubscribe;
    if (user) {
      let momentRef = collection(db, "moment");
      const myMomentQuery = query(
        momentRef,
        where("userId", "==", user.uid),
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
    <MyMomentsWrap>
      {myMoments?.length > 0 ? (
        myMoments.map((moment) => (
          <ProfileMomentBox moment={moment} key={moment.id} />
        ))
      ) : (
        <EmptyComment>아직 기록한 순간이 없습니다!</EmptyComment>
      )}
    </MyMomentsWrap>
  );
};

export default MyMoments;
