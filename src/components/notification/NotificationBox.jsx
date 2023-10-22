import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import dayjs from "dayjs";
import useNotification from "../../hooks/useNotification";
import { motion } from "framer-motion";

const Box = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 6px;
  border: 1px solid #e0e0e0;
  margin-bottom: 5px;
  border-radius: 10px;
`;
const Date = styled.span`
  font-size: 0.6rem;
  color: #727272;
`;
const Content = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
`;
const ButtonWrap = styled.div`
  button {
    cursor: pointer;
    margin: 3px;
    border: 1px solid #e0e0e0;
    background-color: #fff;
    font-size: 0.6rem;
    border-radius: 999px;
    padding: 6px;
    &:hover {
      background-color: #e0e0e0;
    }

    &:nth-child(3) {
      color: #a91919;
      border: 1px solid #a91919;
      &:hover {
        background-color: #a91919;
        color: #fff;
      }
    }
  }
`;
const Check = styled.span`
  position: absolute;
  top: 3px;
  right: 5px;
  background-color: #3e7cd9e4;
  width: 12px;
  height: 12px;
  border-radius: 999px;
`;

export default function NotificationBox({ notification }) {
  const navigate = useNavigate();
  const { notifiUpdateQuery, notifiDeleteQuery, notifiMoveQuery } =
    useNotification(notification);

  //읽기 버튼
  const onClickNotiChk = () => {
    notifiUpdateQuery.mutate();
  };
  //삭제버튼
  const onClickNotiDel = () => {
    notifiDeleteQuery.mutate();
  };
  //이동버튼
  const onClickMove = async () => {
    notifiMoveQuery.mutate();
    navigate(notification.url);
  };
  return (
    <Box initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Date>
        {dayjs(notification.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
      </Date>
      <Content>{notification.content}</Content>
      <ButtonWrap>
        <button onClick={onClickMove}>이동</button>
        <button onClick={onClickNotiChk}>읽음</button>
        <button onClick={onClickNotiDel}>삭제</button>
      </ButtonWrap>
      {!notification.isRead && <Check />}
    </Box>
  );
}
