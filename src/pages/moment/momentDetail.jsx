import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase";
import styled from "styled-components";

const Wrap = styled.div``;

const MomentDetail = () => {
  const params = useParams();
  const [moment, setMoment] = useState(null);

  const getMoment = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "moment", params.id);
      //댓글 가져와야하므로 onSnapshot으로 처리
      onSnapshot(docRef, (doc) => {
        setMoment({ ...doc.data(), id: doc.id });
      });
    }
  }, [params.id]);
  useEffect(() => {
    if (params.id) {
      getMoment();
    }
  }, [getMoment, params.id]);
  console.log(moment);
  return <>{moment ? <>{moment.hashTag}</> : "로딩중.."}</>;
};

export default MomentDetail;
