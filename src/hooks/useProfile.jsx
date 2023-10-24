import { useQuery } from "react-query";
import { getMyMoment } from "../utils/firebase";
import { useAuthContext } from "../context/AuthContext";

const useProfile = () => {
  const { user, uid } = useAuthContext();

  //내가 쓴 게시글 가져오기
  const myMomentsQuery = useQuery(["myMoments", uid], () => getMyMoment(user), {
    staleTime: Infinity,
  });
  return { myMomentsQuery };
};

export default useProfile;
