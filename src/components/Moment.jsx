import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { auth, db, first, next } from "../utils/firebase";
import MomentBox from "./MomentBox";
import Loading from "../pages/Loading";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "react-query";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

const MomentWrap = styled(motion.div)`
  width: 100%;
  overflow-y: auto;
`;

const Target = styled.div`
  width: 100%;
  height: 30px;
`;
const Last = styled.div`
  width: 100%;
  height: 50px;
  text-align: center;
  font-weight: 600;
`;

const Moment = () => {
  const ref = useRef();
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting;
  const { isLoading, data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    "moments",
    ({ pageParam }) => {
      return pageParam ? next(pageParam) : first();
    },
    {
      getNextPageParam: (querySnapshots) => {
        //다음 페이지 알려주는 옵션
        if (querySnapshots.size < 5)
          return undefined; //5보다 작으면 페이지가 더이상 없으므로 undefined
        else return querySnapshots.docs[querySnapshots.docs.length - 1]; //마지막 데이터를 기억하기 위함
      },
    }
  );

  if (isPageEnd && hasNextPage) {
    fetchNextPage();
  }
  return (
    <>
      <MomentWrap
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          data?.pages
            .flatMap((page) =>
              page.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            )
            .map((moment) => <MomentBox key={moment.id} moment={moment} />)
          // .map((moment) => <MomentBox key={moment.id} post={moment} />)
          // moments?.map((moment) => <MomentBox key={moment.id} moment={moment} />)
        )}
        <Target ref={ref} />
        <Last>마지막 게시글입니다!</Last>
      </MomentWrap>
    </>
  );
};

export default Moment;
