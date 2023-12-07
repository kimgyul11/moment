import { useState } from "react";
import { auth, uploadMoment } from "@utils/firebase";
import { MdCancel } from "react-icons/md";
import { BsImage } from "react-icons/bs";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { useModalContext } from "../../context/ModalContext";
import {
  AttachImg,
  Form,
  HasTag,
  Imgbox,
  TextArea,
  HashTagWrap,
  AttachFileInput,
  ButtonWrap,
  Button,
  SubmitBtn,
} from "./momentStyled";

const CreateMoment = () => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [hashTag, setHashTag] = useState("");
  const [tags, setTags] = useState([]);
  const { setIsShow } = useModalContext();
  const user = auth.currentUser;

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
    if (!user || isLoading || text.trim() === "" || text.length > 180) return; //유효성 검사
    try {
      setLoading(true);
      //moment업로드
      const dataObj = {
        text: text,
        createdAt: Date.now(),
        username: user.displayName || "익명유저",
        userId: user.uid,
        userPhoto: user.photoURL,
        hashTag: tags,
        imageFile: imageFile || "",
        user: user,
      };
      console.log(imageFile);
      mutate(dataObj);

      setIsShow(false);
      toast.success("모멘트 등록 완료📸");
    } catch (e) {
      toast.error("문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (dataObj, imageFile, user) => uploadMoment(dataObj, imageFile, user),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("moments");
      },
    }
  );
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
              <HasTag
                key={idx}
                onClick={() => hashTagDelteHandler(tag)}
              >{`#${tag}`}</HasTag>
            ))
          ) : (
            <HasTag>#태그를 추가해보세요!</HasTag>
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
