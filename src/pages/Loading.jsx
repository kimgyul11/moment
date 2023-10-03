import styled from "styled-components";

const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #ffffffb7;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const LoadingText = styled.span`
  font-weight: bold;
  font: 1.5 "Noto Sans KR";
  text-align: center;
`;

const Loading = () => {
  return (
    <Background>
      <LoadingText>불러오는 중...👷‍♂️🛠️</LoadingText>
      <img src="/spiner.gif" alt="로딩중입니다." width="5%" />
    </Background>
  );
};

export default Loading;
