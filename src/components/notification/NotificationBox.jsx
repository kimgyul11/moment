import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import dayjs from "dayjs";

const Box = styled.div`
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
const Date = styled.span``;
const Content = styled.span``;
const ButtonWrap = styled.div`
  button {
    cursor: pointer;
    margin: 3px;
    border: none;
    font-size: 0.6rem;
    border-radius: 999px;
    padding: 6px;

    &:nth-child(3) {
      background-color: #a91919;
      color: #fff;
    }
  }
`;
const Check = styled.span`
  position: absolute;
  top: 3px;
  right: 5px;
  background-color: #bb3939;
  width: 12px;
  height: 12px;
  border-radius: 999px;
`;

export default function NotificationBox({ notification }) {
  const navigate = useNavigate();
  //읽음버튼
  const onClickNotiChk = async () => {
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });
  };
  //삭제버튼
  const onClickNotiDel = async () => {
    await deleteDoc(doc(db, "notifications", notification.id));
  };
  return (
    <Box>
      <Date>
        {dayjs(notification.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
      </Date>
      <Content>{notification.content}</Content>
      <ButtonWrap>
        <button onClick={() => navigate(notification.url)}>이동</button>
        <button onClick={onClickNotiChk}>읽음</button>
        <button onClick={onClickNotiDel}>삭제</button>
      </ButtonWrap>
      {!notification.isRead && <Check />}
    </Box>
  );
}
