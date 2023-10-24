import React from "react";
import styled from "styled-components";

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  height: 50px;

  p {
    width: 150px;
    height: 30px;
    margin: 12px;
    border-radius: 999px;
    border: 1px solid #e0e0e0;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .active {
    background-color: #85d6d3;
    color: #fff;
  }
`;
const ProfileTab = ({ setActiveTab, activeTab }) => {
  return (
    <Tab>
      <p
        className={activeTab === "like" ? "active" : ""}
        onClick={() => setActiveTab("like")}
      >
        좋아요한 모멘트
      </p>
      <p
        className={activeTab === "following" ? "active" : ""}
        onClick={() => setActiveTab("following")}
      >
        친구의 모멘트
      </p>
    </Tab>
  );
};

export default ProfileTab;
