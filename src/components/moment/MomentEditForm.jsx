import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../utils/firebase";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FcAddImage } from "react-icons/fc";
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
  border: 1px solid #e0e0e0;
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

  input {
    display: none;
  }
`;
const MomentPhoto = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 150px;
  height: 150px;
  margin: auto;
  border: 1px solid #e0e0e0;
  border-radius: 5px;

  img {
    width: 130px;
  }
  svg {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    color: red;
    font-size: 1.2rem;
  }
  label {
    font: 1rem;
    color: #bbb4b4;
    cursor: pointer;
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
  height: 100px;
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
  padding: 2px;

  border-radius: 999px;
  font-size: 0.6rem;
  cursor: pointer;
`;

const TagsWrap = styled.div`
  width: 100%;
  height: 50%;
  flex-wrap: wrap;
  padding: 4px;
  overflow-y: auto;
`;
const InputWrap = styled.div`
  height: 50%;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ButtonWrap = styled.div`
  display: flex;

  p,
  input {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    width: 50px;
    height: 20px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    background-color: #000;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
  }
  :nth-child(1) {
    background-color: #b52a2a;
    color: #fff;
    margin-right: 5px;
  }
`;

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
        if (moment.photo !== imageFile) {
          //1.기존 이미지가 변경되었다면 원본 이미지 삭제
          let imageRef = ref(storage, key);
          await deleteObject(imageRef).catch((error) => {
            console.log(error);
          });

          if (imageFile) {
            //2.새로운 이미지가 있다면 업로드하고 업데이트
            const data = await uploadString(storageRef, imageFile, "data_url");
            imageUrl = await getDownloadURL(data.ref);
            const momentRef = doc(db, "moment", moment.id);
            await updateDoc(momentRef, {
              text: content,
              hashTag: tags,
              photo: imageUrl,
            });
          } else {
            //3.이미지가 삭제된 경우 업데이트
            const momentRef = doc(db, "moment", moment.id);
            await updateDoc(momentRef, {
              text: content,
              hashTag: tags,
              photo: "",
            });
          }
          navigate(`/moment/${moment.id}`);
          toast.success("게시글 수정 완료!");
        } else {
          //이미지가 변경되지 않았다면 해시태그,텍스트 중 하나만 변경이 일어났으므로 업데이트
          const momentRef = doc(db, "moment", moment.id);
          await updateDoc(momentRef, {
            text: content,
            hashTag: tags,
          });
          navigate(`/moment/${moment.id}`);
          toast.success("게시글 수정 완료!");
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
  //이미지 삭제
  const onImgDelete = () => {
    setImageFile("");
  };
  const onClickBack = () => {
    const ok = window.confirm("취소하시겠습니까?");
    if (ok) {
      navigate(-1);
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
                <MomentPhoto>
                  {imageFile ? (
                    <>
                      <img src={imageFile} />
                      <IoIosCloseCircleOutline onClick={onImgDelete} />
                    </>
                  ) : (
                    <>
                      <label htmlFor="file-input">이미지를 추가해보세요</label>
                    </>
                  )}
                </MomentPhoto>

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
                      # {tag}
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
                  <ButtonWrap>
                    <p onClick={onClickBack}>취소</p>
                    <input type="submit" value="수정" disabled={isSubmitting} />
                  </ButtonWrap>
                </InputWrap>
              </Footer>
            </Box>
          </Form>
        </Wrap>
      )}
    </>
  );
}
