import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Lable,
  Linkbtn,
  Title,
  Wrap,
} from "../assets/styled_component/login-signup";
import GoogleBtn from "../components/GoogleBtn";
import styled from "styled-components";
import GithubBtn from "../components/GithubBtn";
import Anonymous from "../components/Anonymous";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

const SocialBtnWrap = styled.div`
  width: 100%;
  margin-top: 15px;
  display: flex;
  justify-content: center;
`;
const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
`;
const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isLoading || loginInfo.email === "" || loginInfo.password === "")
      return;
    try {
      console.log(loginInfo.email, loginInfo.password);
      setIsLoading(true);
      await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password
      );
      navigate("/");
      toast.success("로그인 완료!");
    } catch (e) {
      toast.error("문제가 발생했습니다.");
      if (e instanceof FirebaseError) {
        setError(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //change
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setLoginInfo((prev) => ({ ...prev, email: value }));
    }
    if (name === "password") {
      setLoginInfo((prev) => ({ ...prev, password: value }));
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
            type="email"
            placeholder="이메일을 입력해 주세요"
            name="email"
            value={loginInfo.email}
            onChange={onChange}
            required
          />
        </InputWrap>
        <InputWrap>
          <Lable>비밀번호</Lable>
          <Input
            type="password"
            placeholder="비밀번호"
            name="password"
            value={loginInfo.password}
            onChange={onChange}
            required
          />
        </InputWrap>
        <Button>로그인</Button>
        <p>{error}</p>
        <SocialBtnWrap>
          <GoogleBtn />
          <GithubBtn />
          <Anonymous />
        </SocialBtnWrap>
      </Form>

      <Linkbtn>
        <Link to="/sign-up">아직 아이디가 없으신가요?</Link>
      </Linkbtn>
    </Wrap>
  );
};

export default Login;
