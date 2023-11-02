import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
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
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

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
  const first = query(
    collection(db, "moment"),
    orderBy("createdAt", "desc"),
    limit(5)
  );

  const postSnap = await getDocs(first);
  return postSnap;
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

//[모멘트]1.업로드하기
export const uploadMoment = async (dataObj) => {
  const docs = await addDoc(collection(db, "moment"), {
    text: dataObj.text,
    createdAt: dataObj.createdAt,
    username: dataObj.username,
    userId: dataObj.userId,
    userPhoto: dataObj.userPhoto,
    hashTag: dataObj.hashTag,
  });

  if (dataObj.imageFile) {
    const storageRef = ref(
      storage,
      `moment/${dataObj?.user.uid}/${docs.id}-${dataObj.user?.displayName}`
    );
    const data = await uploadString(storageRef, dataObj.imageFile, "data_url");
    const imageUrl = await getDownloadURL(data.ref);
    await updateDoc(docs, {
      photo: imageUrl,
    });
  }
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

//[알림]5.알림 추가하기
export const addNotification = async (user) => {
  //회원가입 알림
  await addDoc(collection(db, "notifications"), {
    createdAt: Date.now(),
    content: `${user.displayName}님 회원가입을 축하합니다.🎉`,
    url: "",
    isRead: false,
    userId: user.uid,
  });
};
