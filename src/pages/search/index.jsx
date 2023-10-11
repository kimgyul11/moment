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
`;
const SearchBox = styled.div``;
const Title = styled.span`
  font-size: 2rem;
`;
const Input = styled.input``;

const ContentWrap = styled.div``;

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
        <Input value={dataQuery} onChange={onChange} />
      </SearchBox>
      <ContentWrap>
        {moments.length > 0 ? (
          moments.map((moment) => <MomentBox key={moment.id} moment={moment} />)
        ) : (
          <p>검색결과 없슴</p>
        )}
      </ContentWrap>
    </Wrap>
  );
};

export default Search;
