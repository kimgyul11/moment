import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ProfileInfomation = styled.div`
  text-align: center;
  margin-top: 30px;
  height: 200px;

  img {
    border: 1px solid #e0e0e0;
    width: 100px;
    height: 100px;
    border-radius: 999px;
  }
  p {
    margin-top: 10px;
    font-size: 1.5rem;
    font-weight: 700;
  }
  button {
    margin-top: 6px;
    padding: 6px;
    border-radius: 999px;
    border: 1px solid #66b7d7;
    color: #66b7d7;
    background: #fff;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: #66b7d7;
      color: #fff;
    }
  }
`;
const ProfileInfo = ({ user }) => {
  const navigate = useNavigate();

  return (
    <ProfileInfomation>
      {user.photoURL ? (
        <img src={user.photoURL} />
      ) : (
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
      )}

      <p>{user?.displayName}</p>
      <button onClick={() => navigate("/profile/edit")}>프로필 수정하기</button>
    </ProfileInfomation>
  );
};

export default ProfileInfo;
