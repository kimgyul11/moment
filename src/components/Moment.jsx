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

  // const observerRef = useRef();
  // const lastPostRef = useCallback(
  //   (moment) => {
  //     // next page를 loading중이라면 return
  //     if (isFetchingNextPage) return;

  //     // observerRef 가 존재한다면 target의 관찰을 중지한다.
  //     if (observerRef.current) {
  //       observerRef.current.disconnect();
  //     }

  //     observerRef.current = new IntersectionObserver((moments) => {
  //       console.log("intersection moments", moments[0].isIntersecting);
  //       // target과 상위요소가 교차됬고 다음 페이지가 존재할 때 fetchNextPage 함수 호출
  //       if (moments[0].isIntersecting && hasNextPage) {
  //         fetchNextPage();
  //       }
  //     });

  //     // 다음 관찰 요소 관찰 시작
  //     if (moment) {
  //       observerRef.current.observe(moment);
  //     }
  //   },
  //   [isFetchingNextPage, fetchNextPage, hasNextPage]
  // );
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
      </MomentWrap>
    </>
  );
};

export default Moment;
