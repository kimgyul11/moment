import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase";
import styled from "styled-components";
import MomentBox from "../../components/MomentBox";
import CommentForm from "../../components/comment/CommentForm";
import dayjs from "dayjs";
import CommentBox from "../../components/comment/CommentBox";
import Loading from "../Loading";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
`;

const CommentWrap = styled.div`
  border: 1px solid #e0e0e0;
  padding: 12px;
  border-radius: 5px;
  margin-top: 15px;
  width: 50%;
  overflow: auto;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const MomentDetail = () => {
  const params = useParams();
  const [moment, setMoment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    if (params.id) {
      getMoment();
      setIsLoading(false);
    }
  }, [getMoment, params.id]);

  return (
    <>
      {moment ? (
        <Wrap>
          <MomentBox moment={moment} />
          <CommentForm moment={moment} />
          <CommentWrap>
            {moment.comment &&
              moment.comment
                .slice(0)
                .map((data) => (
                  <CommentBox
                    data={data}
                    key={data.commentId}
                    moment={moment}
                  />
                ))}
          </CommentWrap>
        </Wrap>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default MomentDetail;
