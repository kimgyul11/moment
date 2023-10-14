import dayjs from "dayjs";
import styled from "styled-components";
import { auth } from "../../utils/firebase";

const Wrap = styled.div`
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
`;
const Comment = styled.div`
  width: 100%;
  padding: 8px 4px;
  white-space: pre;
`;

export default function CommentBox({ data, moment }) {
  const user = auth.currentUser;
  return (
    <Wrap>
      <Header>
        <p>{data?.nickname}</p>
        <p>{dayjs(data?.createdAt).format("YYYY년 MM월 DD일 HH:mm")}</p>
        {moment?.userId === data?.uid && <p>작성자</p>}
      </Header>
      <Comment>{data?.comment}</Comment>
    </Wrap>
  );
}
