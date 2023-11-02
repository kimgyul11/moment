import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { Link, useNavigate } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  ErrText,
  Form,
  Input,
  InputWrap,
  Lable,
  Linkbtn,
  Mark,
  Title,
  Wrap,
} from "../../assets/styled_component/login-signup";
import { addNotification, auth } from "../../utils/firebase";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    enterdValue: enteredEmail,
    enteredValueIsValid: enteredEmail_valid,
    hasErr: emailhaserr,
    onChange: onChangeEmail,
    onBlur: onBlurEmail,
    complete: completeEmail,
  } = useInput((value) => emailRegex.test(value));
  const {
    enterdValue: enteredNN,
    enteredValueIsValid: enteredNN_valid,
    hasErr: enteredNN_hasErr,
    onChange: onChangeNN,
    onBlur: onBlurNN,
    complete: completeNN,
  } = useInput((value) => value.length >= 2);
  const {
    enterdValue: enteredPW,
    enteredValueIsValid: enteredPW_valid,
    hasErr: enteredPW_hasErr,
    onChange: onChangePW,
    onBlur: onBlurPW,
    complete: completePW,
  } = useInput((value) => passwordRegex.test(value));
  const {
    enterdValue: enteredPWC,
    enteredValueIsValid: enteredPWC_valid,
    hasErr: enteredPWC_hasErr,
    onChange: onChangePWC,
    onBlur: onBlurPWC,
    complete: completePWC,
  } = useInput((value) => value === enteredPW && value !== "");

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
    setLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPW
      );
      await updateProfile(credentials.user, { displayName: enteredNN });
      navigate("/login");
      addNotification(credentials.user);
      toast.success("🎉 환영합니다. ");
    } catch (e) {
      toast.error(e.code);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrap>
      <Form onSubmit={onSubmit}>
        <Title>
          <h1>Moment</h1>
          <em>순간을 기록하다📸</em>
        </Title>
        <InputWrap>
          <Lable>이메일</Lable>
          <Input
            $hasErr={emailhaserr}
            $complate={completeEmail}
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={enteredEmail}
            onChange={onChangeEmail}
            onBlur={onBlurEmail}
            required
          />
          {completeEmail && <Mark src="/check.png" alt="완료마크" />}
          {emailhaserr && (
            <ErrText>올바른 이메일 형식으로 입력해주세요!</ErrText>
          )}
        </InputWrap>
        <InputWrap>
          <Lable>닉네임</Lable>
          <Input
            $hasErr={enteredNN_hasErr}
            $complate={completeNN}
            type="text"
            placeholder="닉네임을 입력해 주세요"
            value={enteredNN}
            onChange={onChangeNN}
            onBlur={onBlurNN}
            required
          />
          {completeNN && <Mark src="/check.png" alt="완료마크" />}
          {enteredNN_hasErr && <ErrText>최소 2글자 이상 작성해주세요</ErrText>}
        </InputWrap>
        <InputWrap>
          <Lable>비밀번호</Lable>
          <Input
            $hasErr={enteredPW_hasErr}
            $complate={completePW}
            type="password"
            placeholder="특수문자를 포함한 6글자 이상"
            value={enteredPW}
            onChange={onChangePW}
            onBlur={onBlurPW}
            required
          />
          {completePW && <Mark src="/check.png" alt="완료마크" />}
          {enteredPW_hasErr && (
            <ErrText>특수문자를 포함한 6글자 이상 이어야 합니다.</ErrText>
          )}
        </InputWrap>
        <InputWrap>
          <Lable>비밀번호 확인</Lable>
          <Input
            $hasErr={enteredPWC_hasErr}
            $complate={completePWC}
            type="password"
            placeholder="비밀번호"
            value={enteredPWC}
            onChange={onChangePWC}
            onBlur={onBlurPWC}
            required
          />
          {completePWC && <Mark src="/check.png" alt="완료마크" />}
          {enteredPWC_hasErr && (
            <ErrText>비밀번호가 일치하지 않습니다.</ErrText>
          )}
        </InputWrap>
        <Button disabled={loading || !formIsValid}>
          {loading ? "회원 생성중..👷‍♂️" : "회원가입"}
        </Button>
      </Form>
      <Linkbtn>
        <Link to="/login">이미 아이디가 있으신가요?</Link>
      </Linkbtn>
    </Wrap>
  );
};

export default Signup;
