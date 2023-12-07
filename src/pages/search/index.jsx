import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@utils/firebase";
import { useParams } from "react-router-dom";
import MomentBox from "@components/moment/MomentBox";
import { motion } from "framer-motion";

const Wrap = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SearchBox = styled.div`
  margin-top: 50px;
  width: 50%;
  text-align: center;
  display: flex;
  flex-direction: column;

  input {
    width: 350px;
    height: 40px;
    border: 1px solid #e0e0e0;
    border-radius: 999px;
    outline: none;
    margin: 20px auto;
    padding: 12px;
    text-align: center;
    font-weight: 700;
  }
`;

const ContentWrap = styled.div`
  width: 100%;

  height: 70vh;
  display: flex;
  flex-direction: column;
`;
const TextBox = styled(motion.p)`
  width: 50%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  color: #ababab;
`;

const Search = () => {
  const params = useParams();
  const [moments, setMoments] = useState([]);
  const [dataQuery, setDataQuery] = useState("");

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setDataQuery(value);
  };
  useEffect(() => {
    let unsubscribe;
    const momentRef = collection(db, "moment");
    const momentQuery = query(
      momentRef,
      where("hashTag", "array-contains-any", [dataQuery]),
      orderBy("createdAt", "desc")
    );

    unsubscribe = onSnapshot(momentQuery, (snapShot) => {
      let dataObj = snapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMoments(dataObj);
    });
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [dataQuery]);
  useEffect(() => {
    if (params.id) {
      setDataQuery(params.id);
    }
  }, [params]);

  return (
    <Wrap>
      <SearchBox>
        <input value={dataQuery} onChange={onChange} placeholder="# 해시태그" />
      </SearchBox>
      <ContentWrap>
        {moments.length > 0 ? (
          moments.map((moment) => <MomentBox key={moment.id} moment={moment} />)
        ) : (
          <TextBox
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
          >
            {!params.id && !dataQuery
              ? "태그를 검색해 보세요!"
              : "검색된 태그가 없습니다😭"}
          </TextBox>
        )}
      </ContentWrap>
    </Wrap>
  );
};

export default Search;
