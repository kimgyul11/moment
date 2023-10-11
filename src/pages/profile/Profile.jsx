import React, { useState } from "react";
import styled from "styled-components";
import { auth } from "../../utils/firebase";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProfileWrap = styled.div`
  width: 80%;
  height: 80vh;
  background: beige;
`;
const LeftInfo = styled.div`
  width: 50%;
  height: 100%;

  background-color: #b9b9a9;
`;
const Img = styled.img``;
const Info = styled.div``;

const Profile = () => {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user.displayName || "사용자");
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [isEdit, setIsEdit] = useState(false);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  return (
    <Wrap>
      <ProfileWrap>
        <LeftInfo>
          <Img />
          <Info>
            {!isEdit && <span>{displayName}</span>}
            {isEdit && <input value={newDisplayName} onChange={onChange} />}
            <button onClick={() => setIsEdit((prev) => !prev)}>
              {isEdit ? "취소" : "수정"}
            </button>
          </Info>
        </LeftInfo>
        {/* 내가 작성한 게시글 보기 */}
      </ProfileWrap>
    </Wrap>
  );
};

export default Profile;
