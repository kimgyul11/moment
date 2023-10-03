import { useRef, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  border: 1px solid #5ea8c9;
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
  cursor: pointer;
`;
const Imgmiri = styled.div`
  width: 100px;
  height: 100px;
`;
const CreateMoment = () => {
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
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
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile(reader.result);
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
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        placeholder="글을 작성해보세요"
        value={text}
        onChange={onChange}
        required
      />
      <AttachFileBtn htmlFor="file">
        {file ? "이미지 추가완료✅" : "사진 업로드"}
      </AttachFileBtn>
      <AttachFileInput
        id="file"
        accept="image/*"
        type="file"
        ref={imgRef}
        onChange={saveImgFile}
      />
      <SubmitBtn type="submit" value={isLoading ? "글 올리는중..." : "확인"} />
      <Imgmiri>
        {file && <img src={file} alt="이미지파일 " />}
        {file && <p onClick={() => setFile("")}>X</p>}
      </Imgmiri>
    </Form>
  );
};

export default CreateMoment;
