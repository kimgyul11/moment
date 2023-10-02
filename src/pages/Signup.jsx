import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput";

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80px;
`;
const ErrText = styled.p`
  color: #c14454;
  font-size: 0.7rem;
  margin-left: 5px;
  margin-top: 5px;
`;

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Title = styled.div`
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
const Form = styled.form`
  width: 20%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 800px) {
    width: 80%;
  }
`;
const Lable = styled.label`
  font-size: 0.8rem;
  margin-left: 8px;
  margin-bottom: 4px;
  font-weight: bold;
  color: #050f07;
`;
const Input = styled.input`
  height: 40px;
  border-radius: 15px;
  padding: 6px;
  border: 1px solid ${({ $hasErr }) => ($hasErr ? "red" : "#e0e0e0")};
  &:focus {
    border: 1px solid #85d6d3;
    outline: none;
  }
`;
const Button = styled.button`
  border: none;
  border-radius: 5px;
  height: 30px;
  background-color: #85d6d3;
  color: #eee;
  font-weight: bold;
  cursor: pointer;
`;
const Linkbtn = styled.p`
  a {
    text-decoration: none;
    color: #050f07;
  }

  text-decoration: underline;
  cursor: pointer;
`;

const Signup = () => {
  const {
    enterdValue: enteredEmail,
    enteredValueIsValid: enteredEmail_valid,
    hasErr: emailhaserr,
    onChange: onChangeEmail,
    onBlur: onBlurEmail,
    reset: resetEmail,
  } = useInput((value) => value.includes("@"));
  const {
    enterdValue: enteredNN,
    enteredValueIsValid: enteredNN_valid,
    hasErr: enteredNN_hasErr,
    onChange: onChangeNN,
    onBlur: onBlurNN,
    reset: resetNN,
  } = useInput((value) => value.length >= 2);
  const {
    enterdValue: enteredPW,
    enteredValueIsValid: enteredPW_valid,
    hasErr: enteredPW_hasErr,
    onChange: onChangePW,
    onBlur: onBlurPW,
    reset: resetPW,
  } = useInput((value) => value.length > 6);
  const {
    enterdValue: enteredPWC,
    enteredValueIsValid: enteredPWC_valid,
    hasErr: enteredPWC_hasErr,
    onChange: onChangePWC,
    onBlur: onBlurPWC,
    reset: resetPWC,
  } = useInput((value) => value === enteredPW);

  //form 유효성검사 체크
  let formIsValid = false;
  if (
    enteredEmail_valid &&
    enteredNN_valid &&
    enteredPW_valid &&
    enteredPWC_valid
  ) {
    formIsValid = true;
  } else {
    formIsValid = false;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formIsValid) return;
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPW
      );
      console.log(credentials);
      await updateProfile(credentials.user, { displayName: enteredNN });
    } catch (e) {
      console.log(e);
    }
    console.log(enteredEmail, enteredNN, enteredPW);
    resetEmail();
    resetNN();
    resetPW();
    resetPWC();
  };
  return (
    <Wrap>
      <Form onSubmit={onSubmit}>
        <Title>
          <h1>Moment</h1>
          <em>순간을 기록하다📸</em>
        </Title>

        <InputWrap>
          <Lable>Email</Lable>
          <Input
            $hasErr={emailhaserr}
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={enteredEmail}
            onChange={onChangeEmail}
            onBlur={onBlurEmail}
          />
          {emailhaserr && (
            <ErrText>올바른 이메일 형식으로 입력해주세요!</ErrText>
          )}
        </InputWrap>
        <InputWrap>
          <Lable>Nickname</Lable>
          <Input
            $hasErr={enteredNN_hasErr}
            type="text"
            placeholder="닉네임을 입력해 주세요"
            value={enteredNN}
            onChange={onChangeNN}
            onBlur={onBlurNN}
          />
          {enteredNN_hasErr && <ErrText>최소 2글자 이상 작성해주세요</ErrText>}
        </InputWrap>
        <InputWrap>
          <Lable>Password</Lable>
          <Input
            $hasErr={enteredPW_hasErr}
            type="password"
            placeholder="비밀번호"
            value={enteredPW}
            onChange={onChangePW}
            onBlur={onBlurPW}
          />
          {enteredPW_hasErr && <ErrText>최소 6글자 이상 작성해주세요</ErrText>}
        </InputWrap>
        <InputWrap>
          <Lable>Password confirm</Lable>
          <Input
            $hasErr={enteredPWC_hasErr}
            type="password"
            placeholder="비밀번호"
            value={enteredPWC}
            onChange={onChangePWC}
            onBlur={onBlurPWC}
          />
          {enteredPWC_hasErr && (
            <ErrText>비밀번호가 일치하지 않습니다.</ErrText>
          )}
        </InputWrap>
        <Button>가입</Button>
      </Form>
      <Linkbtn>
        <Link to="/login">이미 아이디가 있으신가요?</Link>
      </Linkbtn>
    </Wrap>
  );
};

export default Signup;
