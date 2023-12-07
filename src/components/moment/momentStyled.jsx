import styled from "styled-components";
//-- CreateMoment-styledcomponets start
export const Form = styled.form`
  display: flex;
  flex-direction: column;

  padding-top: 20px;
  height: 100%;
`;
export const Imgbox = styled.div`
  margin-bottom: 16px;
  border: 1px dashed #e0e0e0;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;

  label {
    cursor: pointer;
    color: #d4d4d4;
  }
`;
export const AttachImg = styled.div`
  display: flex;
  position: relative;
  padding: 4px;
  img {
    width: 140px;
    height: 140px;
  }
  svg {
    position: absolute;
    cursor: pointer;
    font-size: 1.5rem;
    color: #c3c2c2;
    right: 5px;
  }
`;

export const ButtonWrap = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
export const Button = styled.label`
  width: 50px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  border: none;
  cursor: pointer;
`;
export const TextArea = styled.textarea`
  min-height: 200px;
  border: 2px solid white;
  padding: 14px;
  border-radius: 5px;
  font-size: 16px;
  color: #000;
  width: 100%;
  border: 1px solid #e0e0e0;
  overflow-y: auto;
  margin-bottom: 6px;
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #85d6d3;
  }
`;
export const AttachFileInput = styled.input`
  display: none;
`;
export const HashTagWrap = styled.div`
  div {
    margin-top: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  input {
    margin-top: 5px;
    width: 100%;
    height: 30px;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 16px;
    outline: none;
  }
`;
export const HasTag = styled.p`
  margin: 2px;
  background-color: #85d6d3;
  color: #fff;
  font-weight: 700;
  padding: 6px;
  border-radius: 999px;
  font-size: 0.7rem;
  cursor: pointer;
`;
export const SubmitBtn = styled.input`
  background-color: #85d6d3;
  width: 50px;

  height: 30px;
  color: white;
  border: none;

  font-weight: bold;
  cursor: pointer;
`;
//-- CreateMoment-styledcomponets end
