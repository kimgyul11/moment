import styled from "styled-components";
import NotificationBox from "../../components/notification/NotificationBox";
import { motion } from "framer-motion";
import useNotification from "../../hooks/useNotification";
import Loading from "@shared/Loading";

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
const TextBox = styled(motion.div)`
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
  const {
    notifiQuery: { data, isLoading },
  } = useNotification();

  if (isLoading) return <Loading />;

  return (
    <Wrap>
      <Notifibox>
        {data?.length > 0 ? (
          data.map((noti) => (
            <NotificationBox key={noti.id} notification={noti} />
          ))
        ) : (
          <>
            <TextBox>
              <motion.p
                initial={{ rotate: 10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
              >
                아직 알림이 없습니다.
              </motion.p>
            </TextBox>
          </>
        )}
      </Notifibox>
    </Wrap>
  );
}
