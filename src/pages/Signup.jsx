import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput";
import { useState } from "react";
import {
  Button,
  CompleteText,
  ErrText,
  Form,
  Input,
  InputWrap,
  Lable,
  Linkbtn,
  Title,
  Wrap,
} from "../assets/styled_component/login-signup";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
  } = useInput((value) => value.trim() !== "" && value.length > 6);
  const {
    enterdValue: enteredPWC,
    enteredValueIsValid: enteredPWC_valid,
    hasErr: enteredPWC_hasErr,
    onChange: onChangePWC,
    onBlur: onBlurPWC,
    reset: resetPWC,
    complate: complatePWC,
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
    setLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPW
      );
      console.log(credentials);
      await updateProfile(credentials.user, { displayName: enteredNN });
      navigate("/login");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }

    // resetEmail();
    // resetNN();
    // resetPW();
    // resetPWC();
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
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={enteredEmail}
            onChange={onChangeEmail}
            onBlur={onBlurEmail}
            required
          />
          {emailhaserr && (
            <ErrText>올바른 이메일 형식으로 입력해주세요!</ErrText>
          )}
        </InputWrap>
        <InputWrap>
          <Lable>닉네임</Lable>
          <Input
            $hasErr={enteredNN_hasErr}
            type="text"
            placeholder="닉네임을 입력해 주세요"
            value={enteredNN}
            onChange={onChangeNN}
            onBlur={onBlurNN}
            required
          />
          {enteredNN_hasErr && <ErrText>최소 2글자 이상 작성해주세요</ErrText>}
        </InputWrap>
        <InputWrap>
          <Lable>비밀번호</Lable>
          <Input
            $hasErr={enteredPW_hasErr}
            type="password"
            placeholder="비밀번호"
            value={enteredPW}
            onChange={onChangePW}
            onBlur={onBlurPW}
            required
          />
          {enteredPW_hasErr && <ErrText>최소 6글자 이상 작성해주세요</ErrText>}
        </InputWrap>
        <InputWrap>
          <Lable>비밀번호 확인</Lable>
          <Input
            $hasErr={enteredPWC_hasErr}
            type="password"
            placeholder="비밀번호"
            value={enteredPWC}
            onChange={onChangePWC}
            onBlur={onBlurPWC}
            required
          />
          {enteredPWC_hasErr && (
            <ErrText>비밀번호가 일치하지 않습니다.</ErrText>
          )}
          {complatePWC && <CompleteText>비밀번호가 일치합니다✅</CompleteText>}
        </InputWrap>
        <Button disabled={loading}>
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
