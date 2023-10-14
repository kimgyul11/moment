import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useParams } from "react-router-dom";
import MomentBox from "../../components/MomentBox";

const Wrap = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SearchBox = styled.div`
  width: 50%;
  text-align: center;
  display: flex;
  flex-direction: column;

  input {
    width: 250px;
    height: 40px;
    border: 1px solid #e0e0e0;
    border-radius: 999px;
    outline: none;
    margin: 20px auto;
    padding: 12px;
  }
`;
const Title = styled.span`
  font-size: 2rem;
`;

const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const TextBox = styled.p`
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
        <Title>Search</Title>
        <input
          value={dataQuery}
          onChange={onChange}
          placeholder="해시태그를 입력해보세요!"
        />
      </SearchBox>
      <ContentWrap>
        {moments.length > 0 ? (
          moments.map((moment) => <MomentBox key={moment.id} moment={moment} />)
        ) : (
          <TextBox>검색결과가 없습니다🔎</TextBox>
        )}
      </ContentWrap>
    </Wrap>
  );
};

export default Search;
