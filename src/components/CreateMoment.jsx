import { useRef, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../utils/firebase";
import dayjs from "dayjs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useModalContext } from "../context/ModalContext";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 10px;
  padding-top: 20px;
  height: 100%;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: #000;
  width: 100%;
  border: 1px solid #e0e0e0;
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
const AttachFileBtn = styled.label`
  padding: 10px 0px;
  color: #5ea8c9;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #85d6d3;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #85d6d3;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
`;
const Imgbox = styled.div`
  margin: 16px auto;
  border: 1px dashed #e0e0e0;
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  position: relative;
  label {
    cursor: pointer;
    color: #c3c2c2;
  }
  img {
    width: 150px;
    height: 150px;
  }
  p {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }
`;
const CreateMoment = () => {
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [showImg, setShowImg] = useState("");
  const imgRef = useRef();
  const user = auth.currentUser;

  const onChange = (e) => {
    setText(e.target.value);
  };

  // const onFileChange = (e) => {
  //   const { files } = e.target;
  //   if (files && files.length === 1) {
  //     setFile(files[0]);
  //   }
  // };

  //이미지 미리보기를 위해서 FileReader사용
  const saveImgFile = () => {
    const selectedFile = imgRef.current.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      setShowImg(reader.result);
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user || isLoading || text.trim() === "" || text.length > 180) return;

    try {
      setLoading(true);

      const imgMaxSize = 1024 * 1024;
      const docs = await addDoc(collection(db, "moment"), {
        text,
        createdAt: Date.now(),
        username: user.displayName || "소셜계정",
        userId: user.uid,
        userPhoto: user.photoURL,
      });
      //이미지 크기가 초과할경우 -> docs를 삭제하고 알림을 보낸다.
      if (file && file.size > imgMaxSize) {
        alert("파일 크기가 1MB를 초과합니다.");
        await deleteDoc(doc(db, "moment", docs.id));
        setText("");
        setFile(null);
        setShowImg(null);
        return;
      }
      //이미지가 알맞는 경우 업데이트를 한다.

      if (file && file.size < imgMaxSize) {
        const locationRef = ref(
          storage,
          `moment/${user.uid}/${docs.id}-${user.displayName}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(docs, {
          photo: url,
        });
      }
      setText("");
      setFile(null);
      setShowImg(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <Imgbox>
        {!showImg && <label htmlFor="file">순간의 이미지를 올려주세요📸</label>}
        {showImg && <img src={showImg} alt="이미지파일 " />}
        {showImg && <p onClick={() => setShowImg("")}>❎</p>}
      </Imgbox>
      <TextArea
        rows={5}
        maxLength={180}
        placeholder="순간을 기록해주세요."
        value={text}
        onChange={onChange}
        required
      />
      <AttachFileBtn htmlFor="file">
        {file ? "이미지 재선택✅" : "사진 업로드"}
      </AttachFileBtn>
      <AttachFileInput
        id="file"
        accept="image/*"
        type="file"
        ref={imgRef}
        onChange={saveImgFile}
      />
      <SubmitBtn type="submit" value={isLoading ? "글 올리는중..." : "확인"} />
    </Form>
  );
};

export default CreateMoment;
