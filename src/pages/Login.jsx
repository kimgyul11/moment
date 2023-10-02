import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Lable,
  Linkbtn,
  Title,
  Wrap,
} from "../assets/styled_component/login-signup";
import { useState } from "react";
import GoogleBtn from "../components/GoogleBtn";
import styled from "styled-components";
import GithubBtn from "../components/GithubBtn";

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
`;
const SocialBtnWrap = styled.div`
  width: 100%;
  margin-top: 15px;
  display: flex;
  justify-content: center;
`;

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const onSubmit = (e) => {
    e.preventDefault();
  };
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setLoginInfo((prev) => ({ ...prev, email: value }));
    }
    if (name === "password") {
      setLoginInfo((prev) => ({ ...prev, password: value }));
    }
    console.log(loginInfo.email, loginInfo.password);
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
        <SocialBtnWrap>
          <GoogleBtn />
          <GithubBtn />
          <GithubBtn />
        </SocialBtnWrap>
      </Form>
      <Linkbtn>
        <Link to="/sign-up">아직 아이디가 없으신가요?</Link>
      </Linkbtn>
    </Wrap>
  );
};

export default Login;
