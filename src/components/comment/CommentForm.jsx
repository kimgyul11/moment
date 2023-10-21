import { useState } from "react";
import { auth, db } from "../../utils/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import styled from "styled-components";

const Wrap = styled.div`
  border-radius: 5px;
  width: 50%;
  height: 130px;
  border: 1px solid #e0e0e0;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  form {
    width: 100%;
    height: 130px;
    padding: 15px;
    position: relative;
  }
  input {
    width: 100px;
    height: 25px;
    background-color: transparent;
    border: 1px solid #e0e0e0;
    border-radius: 15px;
    position: absolute;
    bottom: 5px;
    right: 15px;
    cursor: pointer;
    color: #000;
    font-weight: bold;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  height: 80px;
  border: none;
  outline: none;
  resize: none;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
`;
export default function CommentForm({ moment }) {
  const [comment, setComment] = useState("");
  const user = auth.currentUser;
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (moment && user) {
      const momentRef = doc(db, "moment", moment.id);
      const commentObj = {
        commentId: `${user.uid}-${uuidv4()}`,
        comment: comment,
        uid: user.uid,
        email: user.email,
        nickname: user.displayName || "익명의 사용자",
        createdAt: Date.now(),
      };
      await updateDoc(momentRef, {
        comment: arrayUnion(commentObj),
      });

      if (user.uid !== moment.userId) {
        await addDoc(collection(db, "notifications"), {
          createdAt: Date.now(),
          content: `${
            user.displayName || "익명의 사용자"
          }님이 게시글에 댓글을 남겼습니다.`,
          url: `/moment/${moment.id}`,
          isRead: false,
          userId: moment.userId,
        });
      }

      toast.success("댓글작성 완료");
      setComment("");
    }
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setComment(value);
  };
  return (
    <Wrap>
      <form onSubmit={onSubmitHandler}>
        <TextInput
          type="text"
          value={comment}
          onChange={onChange}
          placeholder="댓글을 작성해보세요!"
        />
        <input type="submit" value="댓글 쓰기" />
      </form>
    </Wrap>
  );
}
