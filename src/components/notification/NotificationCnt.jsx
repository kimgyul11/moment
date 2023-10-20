import React from "react";
import styled from "styled-components";
const CountBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: #fff;
  background: #85d6d3;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  font-size: 1rem;
  position: absolute;
  top: 2px;
  right: 9px;
  @media (max-width: 700px) {
    width: 15px;
    height: 15px;
  }
`;
export default function NotificationCnt({ data }) {
  return <CountBox>{data.filter((noti) => !noti.isRead).length}</CountBox>;
}
