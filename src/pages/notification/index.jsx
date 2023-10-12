import styled from "styled-components";
import { auth, db } from "../../utils/firebase";
import { useEffect, useState } from "react";
import NotificationBox from "../../components/notification/NotificationBox";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const Wrap = styled.div`
  width: 100%;
`;
const Notifibox = styled.div`
  border: 1px solid #e0e0e0;
  width: 50%;
  max-width: 600px;
  height: 100%;
  padding: 12px;
  background-color: white;
  margin: auto;
  overflow: auto;
  @media (max-width: 800px) {
    width: 100%;
  }
`;
const TextBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  width: 100%;
  height: 60px;
  padding: 6px;
  border: 1px solid #e0e0e0;
  margin-bottom: 5px;
  border-radius: 10px;
`;
export default function NotificationPage() {
  const user = auth.currentUser;
  const [notifications, setNotifications] = useState([]);

  //알림 가져오기
  useEffect(() => {
    let unsubscribe;
    if (user) {
      let ref = collection(db, "notifications");
      let notificationQuery = query(
        ref,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(notificationQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotifications(dataObj);
      });
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [user]);
  return (
    <Wrap>
      <Notifibox>
        {notifications.length > 0 ? (
          notifications.map((noti) => (
            <NotificationBox key={noti.id} notification={noti} />
          ))
        ) : (
          <>
            <TextBox>알림이 없습니다.</TextBox>
          </>
        )}
      </Notifibox>
    </Wrap>
  );
}
