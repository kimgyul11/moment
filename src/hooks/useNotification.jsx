import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuthContext } from "../context/AuthContext";
import {
  deleteNotification,
  getNotifications,
  moveNotification,
  updateNotification,
} from "../utils/firebase";

const useNotification = (notification) => {
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();

  //데이터 가져오기
  const notifiQuery = useQuery(
    ["notifications", uid],
    () => getNotifications(uid),
    {
      staleTime: 2000,
      enabled: !!uid,
    }
  );

  //알림 읽음
  const notifiUpdateQuery = useMutation(
    () => updateNotification(notification),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  //알림 삭제
  const notifiDeleteQuery = useMutation(
    () => deleteNotification(notification),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
    }
  );

  //알림 이동
  const notifiMoveQuery = useMutation(() => moveNotification(notification), {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  return {
    notifiQuery,
    notifiUpdateQuery,
    notifiDeleteQuery,
    notifiMoveQuery,
  };
};

export default useNotification;
