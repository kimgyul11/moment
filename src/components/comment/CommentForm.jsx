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
export default function CommentForm({ moment }) {
  const [comment, setComment] = useState("");
  const user = auth.currentUser;
  console.log(user);
  console.log(moment);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (moment && user) {
      const momentRef = doc(db, "moment", moment.id);
      const commentObj = {
        commentId: `${user.uid}-${uuidv4()}`,
        comment: comment,
        uid: user.uid,
        email: user.email,
        nickname: user.displayName,
        createdAt: Date.now(),
      };
      await updateDoc(momentRef, {
        comment: arrayUnion(commentObj),
      });

      if (user.uid !== moment.userId) {
        await addDoc(collection(db, "notifications"), {
          createdAt: Date.now(),
          content: `${
            user.displayName || user.email
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
    <div>
      <form onSubmit={onSubmitHandler}>
        <input type="text" value={comment} onChange={onChange} />
        <input type="submit" value="전송" />
      </form>
    </div>
  );
}
