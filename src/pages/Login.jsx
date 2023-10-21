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

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import Anonymous from "../components/login/Anonymous";

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

const ErrorText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 5px;
  font-weight: 700;
  color: #e94242;
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
    if (loginInfo.password.length < 6) {
      setError("암호가 너무 짧습니다.");
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password
      );
      navigate("/");
      toast.success("로그인 완료!");
    } catch (e) {
      if (
        e.code === "auth/invalid-login-credentials" ||
        err.code == "auth/user-not-found" ||
        err.code == "auth/invalid-email"
      ) {
        toast.error("계정 정보를 다시 확인해주세요.");
      }
      if (err.code == "auth/too-many-requests") {
        toast.error("잠시 후 다시 시도해주세요.");
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
        <Button disabled={isLoading}>로그인</Button>
        <ErrorText>{error}</ErrorText>
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
