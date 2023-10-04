import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../utils/firebase";
import MomentBox from "./MomentBox";

const MomentWrap = styled.div`
  width: 100%;
  height: 500px;
  border: 1px solid;
  overflow-y: scroll;
`;

const Moment = () => {
  const [moments, setMoments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsubscribe = null;
    const fetchMoment = async () => {
      const momentQuery = query(
        collection(db, "moment"),
        orderBy("createdAt", "desc"),
        limit(15)
      );
      // onSnpshot은 페이지 벗어날때 unsubscribe를 반환한다. useEff의 cleanup을 통해서 불필요한 렌더링 줄인다.
      unsubscribe = await onSnapshot(momentQuery, (snapshot) => {
        const moments = snapshot.docs.map((doc) => {
          const { text, createdAt, userId, username, photo, userPhoto } =
            doc.data();
          return {
            text,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
            userPhoto,
          };
        });
        setMoments(moments);
      });
    };
    try {
      setIsLoading(true);
      fetchMoment();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  console.log(moments);
  return (
    <MomentWrap>
      {isLoading
        ? "로딩중"
        : moments.map((moment) => <MomentBox key={moment.id} {...moment} />)}
    </MomentWrap>
  );
};

export default Moment;
