import styled from "styled-components";

export const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80px;
`;
export const ErrText = styled.p`
  color: #c14454;
  font-size: 0.7rem;
  margin-left: 5px;
  margin-top: 5px;
`;
export const CompleteText = styled.p`
  color: #2f4a8e;
  font-size: 0.7rem;
  margin-left: 5px;
  margin-top: 5px;
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  h1 {
    font-size: 3rem;
    line-height: 3rem;
  }
  em {
    font-size: 0.8rem;
    font-style: normal;
    text-align: end;
  }
`;

export const Form = styled.form`
  width: 50%;
  height: 80%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 800px) {
    width: 80%;
  }
`;

export const Lable = styled.label`
  font-size: 0.8rem;
  margin-left: 8px;
  margin-bottom: 4px;
  font-weight: bold;
  color: #050f07;
`;
export const Input = styled.input`
  height: 40px;
  border-radius: 15px;
  padding: 6px;
  border: 1px solid ${({ $hasErr }) => ($hasErr ? "red" : "#e0e0e0")};
  &:focus {
    border: 1px solid #85d6d3;
    outline: none;
  }
`;
export const Button = styled.button`
  border: none;
  border-radius: 5px;
  margin-top: 15px;
  height: 30px;
  background-color: #85d6d3;
  color: #eee;
  font-weight: bold;
  cursor: pointer;
  &:disabled {
    background: #a0a0a0;
    cursor: not-allowed;
  }
`;
export const Linkbtn = styled.p`
  a {
    text-decoration: none;
    color: #050f07;
  }

  text-decoration: underline;
  cursor: pointer;
`;
