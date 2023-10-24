import styled from "styled-components";
import ProfileMomentBox from "./profileMoment";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

const MomentWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  border: 1px solid #e0e0e0;
  border-radius: 5px;
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
const FriendMoments = ({ followingIds, activeTab }) => {
  const [likeMoments, setLikeMoments] = useState([]);
  const [followingMoments, setFollowingMoments] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    let likeUnsubscribe;
    let followingUnsubscribe;
    if (user) {
      let momentRef = collection(db, "moment");
      const likeMomentQuery = query(
        momentRef,
        where("likes", "array-contains", user.uid),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const followingMomentQuery = query(
        momentRef,
        where("userId", "in", followingIds),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      likeUnsubscribe = onSnapshot(likeMomentQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikeMoments(dataObj);
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
      likeUnsubscribe && likeUnsubscribe();
      followingUnsubscribe && followingUnsubscribe();
    };
  }, [user, activeTab]);
  return (
    <MomentWrap>
      {activeTab === "like" && (
        <>
          {likeMoments?.length > 0 ? (
            likeMoments.map((moment) => (
              <ProfileMomentBox moment={moment} key={moment.id} />
            ))
          ) : (
            <EmptyComment>아직 좋아요한 모멘트가 없습니다!</EmptyComment>
          )}
        </>
      )}
      {activeTab === "following" && (
        <>
          {followingMoments?.length > 0 ? (
            followingMoments.map((moment) => (
              <ProfileMomentBox moment={moment} key={moment.id} />
            ))
          ) : (
            <EmptyComment>아직 모멘트가 없습니다!</EmptyComment>
          )}
        </>
      )}
    </MomentWrap>
  );
};

export default FriendMoments;
