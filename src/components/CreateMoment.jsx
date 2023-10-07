import { useRef, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../utils/firebase";
import { MdCancel } from "react-icons/md";
import { BsImage } from "react-icons/bs";
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

  padding-top: 20px;
  height: 100%;
`;
const Imgbox = styled.div`
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
const AttachImg = styled.div`
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

const ButtonWrap = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const Button = styled.label`
  width: 50px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  border: none;
  cursor: pointer;
`;
const TextArea = styled.textarea`
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
const AttachFileInput = styled.input`
  display: none;
`;
const HashTagWrap = styled.div`
  div {
    margin-top: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  p {
    margin: 2px;
    background-color: #85d6d3;
    color: #fff;
    font-weight: 700;
    padding: 6px;
    border-radius: 999px;
    font-size: 0.7rem;
    cursor: pointer;
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
const SubmitBtn = styled.input`
  background-color: #85d6d3;
  width: 50px;

  height: 30px;
  color: white;
  border: none;

  font-weight: bold;
  cursor: pointer;
`;

const CreateMoment = () => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setLoading] = useState(false);

  //해시태그 관련 state
  const [hashTag, setHashTag] = useState("");
  const [tags, setTags] = useState([]);

  const user = auth.currentUser;
  const { setIsShow } = useModalContext();

  const onChange = (e) => {
    setText(e.target.value);
  };
  const onKeyUpHandler = (e) => {
    if (e.keyCode === 32 && e.target.value !== "") {
      if (tags.includes(e.target.value.trim())) {
        toast.error("이미 존재하는 태그입니다.");
      } else {
        setTags((prev) => (prev.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };
  const hashTagDelteHandler = (tag) => {
    setTags(tags.filter((val) => val !== tag));
  };
  const onChangeHandler = (e) => {
    setHashTag(e.target.value.trim());
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

  //submit핸들러
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
        hashTag: tags,
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
      {/* 이미지 박스 */}
      <Imgbox>
        {!imageFile && (
          <label htmlFor="file">순간의 이미지를 올려주세요📸</label>
        )}
        {imageFile && (
          <AttachImg>
            <img src={imageFile} alt="이미지파일 " />
            <MdCancel onClick={() => setImageFile("")} />
          </AttachImg>
        )}
      </Imgbox>
      <TextArea
        rows={5}
        maxLength={180}
        placeholder="순간을 기록해주세요."
        value={text}
        onChange={onChange}
        required
      />
      {/* 해시태그 */}
      <HashTagWrap>
        <div>
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <p
                key={idx}
                onClick={() => hashTagDelteHandler(tag)}
              >{`#${tag}`}</p>
            ))
          ) : (
            <p>#태그를 추가해보세요!</p>
          )}
        </div>
        <input
          type="text"
          placeholder="스페이스바를 눌러 해시태그 추가"
          onChange={onChangeHandler}
          onKeyUp={onKeyUpHandler}
          value={hashTag}
        />
      </HashTagWrap>
      {/* 버튼 */}
      <ButtonWrap>
        <AttachFileInput
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />
        <Button htmlFor="file">
          <BsImage />
        </Button>
        <SubmitBtn type="submit" value={isLoading ? "저장중.." : "작성"} />
      </ButtonWrap>
    </Form>
  );
};

export default CreateMoment;
