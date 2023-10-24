import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../utils/firebase";
import { motion } from "framer-motion";

import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileTab from "../../components/profile/ProfileTab";
import MyMoments from "../../components/profile/MyMoments";
import FriendMoments from "../../components/profile/FriendMoments";
import { doc, onSnapshot } from "firebase/firestore";

const Wrap = styled(motion.div)`
  width: 100%;
  height: 100vh;
  display: flex;
  padding: 24px;

  @media (max-width: 800px) {
    flex-direction: column;
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
  h3 {
    width: 100%;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 12px;
  }
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

const Profile = () => {
  const [followingIds, setFollowingIds] = useState([""]);
  const [activeTab, setActiveTab] = useState("like");
  const user = auth.currentUser;

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

  return (
    <Wrap
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <LeftInfo>
        <ProfileInfo user={user} />
        <h3>내가 기록한 순간들✨</h3>
        <MyMoments />
      </LeftInfo>

      <RightInfo>
        <ProfileTab activeTab={activeTab} setActiveTab={setActiveTab} />
        <FriendMoments activeTab={activeTab} followingIds={followingIds} />
      </RightInfo>
    </Wrap>
  );
};

export default Profile;
