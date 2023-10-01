import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";

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
  border: 1px solid #e0e0e0;
  border-radius: 15px;
  padding: 6px;
  margin-bottom: 14px;
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
  const navigate = useNavigate();
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const onChange = (e) => {
    const {
      target: { name },
    } = e;
    const {
      target: { value },
    } = e;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
    if (name === "nickname") {
      setuserName(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userName === "" || email === "" || password === "") return;
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials);
      await updateProfile(credentials.user, { displayName: userName });
    } catch (e) {
      console.log(e);
    }
    console.log(userName, password, email);
  };
  return (
    <Wrap>
      <Form onSubmit={onSubmit}>
        <Title>
          <h1>Moment</h1>
          <em>순간을 기록하다📸</em>
        </Title>
        <Lable>Email</Lable>
        <Input
          type="email"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={onChange}
          name="email"
        />
        <Lable>Nickname</Lable>
        <Input
          type="text"
          placeholder="닉네임을 입력해 주세요"
          value={userName}
          onChange={onChange}
          name="nickname"
        />
        <Lable>Password</Lable>
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={onChange}
          name="password"
        />
        <Lable>Password confrim</Lable>
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={onChange}
          name="password"
        />
        <Button>가입</Button>
      </Form>
      <Linkbtn>
        <Link to="/login">이미 아이디가 있으신가요?</Link>
      </Linkbtn>
    </Wrap>
  );
};

export default Signup;
