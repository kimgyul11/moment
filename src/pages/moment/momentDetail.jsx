import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase";
import styled from "styled-components";
import MomentBox from "../../components/MomentBox";
import CommentForm from "../../components/comment/CommentForm";
import dayjs from "dayjs";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  console.log(moment);

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
          {moment.comment &&
            moment.comment.slice(0).map((data) => (
              <div key={data.commentId}>
                <span>{data.comment}</span>
                <span>{data.nickname}</span>
                <span>
                  {dayjs(data.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
                </span>
              </div>
            ))}
        </Wrap>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default MomentDetail;
