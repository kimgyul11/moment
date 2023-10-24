import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../utils/firebase";
import MomentBox from "./MomentBox";
import Loading from "../pages/Loading";
import { motion } from "framer-motion";

const MomentWrap = styled(motion.div)`
  width: 100%;
  overflow-y: auto;
`;

const Moment = () => {
  const [moments, setMoments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;
  useEffect(() => {
    let unsubscribe;
    setIsLoading(true);
    if (user) {
      const momentQuery = query(
        collection(db, "moment"),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(momentQuery, (snapshot) => {
        let dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMoments(dataObj);
      });
    }
    setIsLoading(false);
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <MomentWrap
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {isLoading ? (
        <Loading />
      ) : (
        moments?.map((moment) => <MomentBox key={moment.id} moment={moment} />)
      )}
    </MomentWrap>
  );
};

export default Moment;
