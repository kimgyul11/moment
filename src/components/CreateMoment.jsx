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
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useModalContext } from "../context/ModalContext";
import { toast } from "react-toastify";

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
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const user = auth.currentUser;
  const { setIsShow } = useModalContext();
  const onChange = (e) => {
    setText(e.target.value);
  };

  //이미지 업로드 핸들러
  const handleFileUpload = (e) => {
    const {
      target: { files },
    } = e;
    const imgMaxSize = 1024 * 1024;
    const file = files?.[0];
    if (file.size > imgMaxSize) {
      alert("1MB이상의 사진은 업로드 불가능합니다.");
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e) => {
      const { result } = e?.currentTarget;

      setImageFile(result);
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user || isLoading || text.trim() === "" || text.length > 180) return;

    try {
      setLoading(true);
      //moment업로드
      const docs = await addDoc(collection(db, "moment"), {
        text,
        createdAt: Date.now(),
        username: user.displayName || "소셜계정",
        userId: user.uid,
        userPhoto: user.photoURL,
      });

      //이미지 파일이 있다면 storage에 이미지를 업로드하고, collection을 업데이트한다.
      if (imageFile) {
        const storageRef = ref(
          storage,
          `moment/${user.uid}/${docs.id}-${user.displayName}`
        );
        const data = await uploadString(storageRef, imageFile, "data_url");
        const imageUrl = await getDownloadURL(data.ref);
        await updateDoc(docs, {
          photo: imageUrl,
        });
      }

      //모든 입력창 초기화한다.
      setImageFile(null);
      setText("");
      setIsShow(false);
      toast.success("모멘트 등록 완료📸");
    } catch (e) {
      toast.error("문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <Imgbox>
        {!imageFile && (
          <label htmlFor="file">순간의 이미지를 올려주세요📸</label>
        )}
        {imageFile && <img src={imageFile} alt="이미지파일 " />}
        {imageFile && <p onClick={() => setImageFile("")}>❎</p>}
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
        {imageFile ? "이미지 재선택✅" : "사진 업로드"}
      </AttachFileBtn>
      <AttachFileInput
        id="file"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />
      <SubmitBtn type="submit" value={isLoading ? "글 올리는중..." : "확인"} />
    </Form>
  );
};

export default CreateMoment;
