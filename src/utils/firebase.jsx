import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

//로그아웃
export const onLogOut = async () => {
  await auth.signOut();
};
//무한스크롤

export const first = async () => {
  //남은 게시글이 있는지 확인하는 변수
  // const lastVisible = undefined;
  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  console.log("last", lastVisible);
  let q;
  if (lastVisible === -1) {
    return;
  } else if (lastVisible) {
    q = query(
      collection(db, "moment"),
      orderBy("createdAt", "desc"),
      startAfter(pageParam),
      limit(5)
    );
  } else {
    //최초 페이지 렌더링
    q = query(collection(db, "moment"), orderBy("createdAt", "desc"), limit(5));
  }
  const first = query(
    collection(db, "moment"),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const documentSnapshots = await getDocs(first);
  return documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const next = async (pageParam) => {
  const next = query(
    collection(db, "moment"),
    orderBy("createdAt", "desc"),
    startAfter(pageParam),
    limit(5)
  );
  const nextSnap = await getDocs(next);
  return nextSnap;
};

//[알림]1.알림 가져오기
export const getNotifications = async (userId) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

//[알림]2.알림 읽기
export const updateNotification = async (notification) => {
  if (!notification.isRead) {
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });
  }
};
//[알림]3.알림 삭제
export const deleteNotification = async (notification) => {
  await deleteDoc(doc(db, "notifications", notification.id));
};

//[알림]4.알림 이동
export const moveNotification = async (notification) => {
  if (!notification.isRead) {
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });
  }
};
