import dayjs from "dayjs";
import styled from "styled-components";
import { auth, db } from "../../utils/firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Wrap = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: end;
  :nth-child(1) {
    font-size: 1.2rem;
    font-weight: 700;
  }
  :nth-child(2) {
    margin-left: 5px;
    font-size: 0.8rem;
    color: #838181;
  }
  :nth-child(3) {
    border-radius: 999px;
    background-color: #85d6d3;
    color: #fff;
    font-size: 0.8rem;
    padding: 4px;
    margin-left: 6px;
  }
`;
const Comment = styled.div`
  width: 100%;
  padding: 8px 4px;
  white-space: pre;
  font-size: 0.9rem;
  color: #141414;
`;
const Button = styled.button`
  position: absolute;
  border: none;
  padding: 4px;
  bottom: 15px;
  right: 5px;
  background: #d50505;
  color: #fff;
  cursor: pointer;
  border-radius: 999px;
`;
export default function CommentBox({ data, moment }) {
  const user = auth.currentUser;
  const onClickDelete = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      try {
        const momentRef = doc(db, "moment", moment.id);
        await updateDoc(momentRef, {
          comment: arrayRemove(data),
        });
        toast.success("댓글이 삭제되었습니다.");
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <Wrap>
      <Header>
        <p>{data?.nickname}</p>
        <p>{dayjs(data?.createdAt).format("YYYY년 MM월 DD일 HH:mm")}</p>
        {moment?.userId === data?.uid && <p>작성자</p>}
      </Header>
      <Comment>{data?.comment}</Comment>
      {data?.uid === user.uid && <Button onClick={onClickDelete}>삭제</Button>}
    </Wrap>
  );
}
