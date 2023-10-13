import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../utils/firebase";
import styled from "styled-components";
import dayjs from "dayjs";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { toast } from "react-toastify";

const Wrap = styled.div`
  width: 100%;
`;
const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 800px) {
    padding: 12px;
  }
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  max-width: 500px;
  height: 500px;
  border: 1px solid;
  padding: 6px;
  @media (max-width: 800px) {
    width: 100%;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid;

  img {
    width: 35px;
    height: 35px;
    border-radius: 999px;
  }
`;
const Profile = styled.div`
  display: flex;
  align-items: center;
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  img {
    width: 130px;
  }
  input {
  }
`;
const TextArea = styled.textarea`
  height: 150px;
  resize: none;
  border: none;
  outline: none;
`;
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 70px;
  background: red;
`;
const Input = styled.input`
  outline: none;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  height: 30px;
  width: 200px;
  padding: 6px;
`;
const DateForm = styled.p`
  font-size: 0.8rem;
`;
const Tag = styled.span`
  margin: 0px 4px;
  background-color: #85d6d3;
  color: #fff;
  font-weight: 700;
  padding: 6px;
  border-radius: 999px;
  font-size: 0.7rem;
  cursor: pointer;
`;
const InputSubmit = styled.input``;
const TagsWrap = styled.div``;
const InputWrap = styled.div``;
export default function MomentEditForm() {
  const [moment, setMoment] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [content, setContent] = useState(null);
  const [newHashTag, setNewHashTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  const getPost = useCallback(async () => {
    if (params.id) {
      const defRef = doc(db, "moment", params.id);
      const docSnap = await getDoc(defRef);
      setMoment({ ...docSnap.data(), id: docSnap.id });
      setContent(docSnap.data().text);
      setTags(docSnap.data().hashTag);
      setImageFile(docSnap.data().photo);
    }
  }, [params.id]);
  useEffect(() => {
    getPost();
  }, [params.id]);

  //추가된 해시태그를 눌렀을때 삭제되는 이벤트
  const removeTag = (tag) => {
    setTags(tags?.filter((val) => val !== tag));
  };
  //키보드를 눌렀을때 이벤트
  const handleKeyUp = (e) => {
    //키코드가 32(스페이스) 이고, 값이 비어있지 않을때 로직을 수행한다.
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      //만약 같은 태그가 있다면 중복된 태그임을 알려주고 아니면 tags에 저장해준다.
      if (tags.includes(e.target.value.trim())) {
        toast.error("이미 존재하는 태그입니다.");
      } else {
        setTags((prev) =>
          prev?.length > 0 ? [...prev, newHashTag] : [newHashTag]
        );
        setNewHashTag("");
      }
    }
  };
  const onChangeHashTag = (e) => {
    setNewHashTag(e.target.value.trim());
  };
  const handleFileUpload = (e) => {
    const {
      target: { files },
    } = e;
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onloadend = (e) => {
      const { result } = e.currentTarget;
      setImageFile(result);
    };
  };

  //submit이벤트
  const onSubmit = async (e) => {
    setIsSubmitting(true);
    const key = `moment/${moment.userId}/${moment.id}-${moment.username}`;
    const storageRef = ref(storage, key);

    e.preventDefault();
    try {
      let imageUrl = "";
      if (moment) {
        //1.기존 이미지가 변경되었다면 원본 이미지 삭제
        if (moment.photo !== imageFile) {
          let imageRef = ref(storage, key);
          await deleteObject(imageRef).catch((error) => {
            console.log(error);
          });
          //2.새로운 이미지를 업로드하고 업데이트
          if (imageFile) {
            const data = await uploadString(storageRef, imageFile, "data_url");
            imageUrl = await getDownloadURL(data.ref);

            const momentRef = doc(db, "moment", moment.id);
            await updateDoc(momentRef, {
              text: content,
              hashTag: tags,
              photo: imageUrl,
            });
            navigate(`/moment/${moment.id}`);
            toast.success("게시글 수정 완료!");
            return;
          }
        }
        if (!imageFile) {
          const momentRef = doc(db, "moment", moment.id);
          await updateDoc(momentRef, {
            text: content,
            hashTag: tags,
            photo: "",
          });
        }
      }
    } catch (e) {
    } finally {
      setImageFile(null);
      setIsSubmitting(false);
    }
  };
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "content") {
      setContent(value);
    }
  };
  return (
    <>
      {moment && (
        <Wrap>
          <Form onSubmit={onSubmit}>
            <Box>
              <Header>
                <Profile>
                  <img src={moment.userPhoto} alt="profile" />
                  <p>{moment.username}</p>
                </Profile>
                <DateForm>
                  {dayjs(moment.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
                </DateForm>
              </Header>
              <Body>
                {imageFile && (
                  <>
                    <img src={imageFile} />
                    <p>이미지 삭제</p>
                  </>
                )}

                <label htmlFor="file-input">이미지</label>
                <input
                  id="file-input"
                  type="file"
                  name="file-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <TextArea value={content} onChange={onChange} name="content" />
              </Body>
              <Footer>
                <TagsWrap>
                  {tags?.map((tag, idx) => (
                    <Tag key={idx} onClick={() => removeTag(tag)}>
                      #{tag}
                    </Tag>
                  ))}
                </TagsWrap>
                <InputWrap>
                  <Input
                    placeholder="해시태그 + 스페이스 입력"
                    onKeyUp={handleKeyUp}
                    onChange={onChangeHashTag}
                    value={newHashTag}
                  />
                  <InputSubmit
                    type="submit"
                    value="수정"
                    disabled={isSubmitting}
                  />
                </InputWrap>
              </Footer>
            </Box>
          </Form>
        </Wrap>
      )}
    </>
  );
}
