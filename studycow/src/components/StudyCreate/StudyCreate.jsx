import "./styles/StudyCreate.css";
import Infobox from "./Infobox";
import useStudyStore from "../../stores/study";
import { useState } from "react";
import { useNavigate } from "react-router";
import Notiflix from 'notiflix';

const StudyCreate = () => {
  const [roomTitle, setRoomTitle] = useState("");
  const [roomMaxPerson, setRoomMaxPerson] = useState("");
  const [roomEndDate, setRoomEndDate] = useState("");
  const [roomContent, setRoomContent] = useState("");
  const [roomThumb, setRoomThumb] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const { setStudyRoomData, submitStudyRoomData } = useStudyStore();
  const navigate = useNavigate();

  const isValidForm = () => {
    if (!roomTitle || !roomMaxPerson || !roomEndDate || !roomContent) {
      Notiflix.Notify.failure("모든 필드를 채워주소ㅜㅜ");
      return false;
    }

    if (isNaN(roomMaxPerson) || roomMaxPerson <= 0) {
      Notiflix.Notify.failure("숫자를 입력하소ㅜㅜ");
      return false;
    }

    const today = new Date();
    const endDate = new Date(roomEndDate);
    if (endDate <= today) {
      Notiflix.Notify.failure("만료일은 오늘 이후로 해주소ㅜㅜ");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isValidForm()) return;

    setStudyRoomData({
      roomTitle,
      roomMaxPerson,
      roomEndDate,
      roomContent,
      roomThumb,
    });

    const success = await submitStudyRoomData();
    if (success) {
      Notiflix.Notify.success("방 생성하기가 성공했소!");
      navigate("/study");
    } else {
      Notiflix.Notify.failure("방 생성에 실패했소...");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRoomThumb(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImgPreview(null);
    }
  };

  return (
    <div className="mainbox">
      <div>
        <div className="Info">
          <div className="Thumbnail">
            <div>
              <div className="subbox">
                {imgPreview ? (
                  <img
                    src={imgPreview}
                    alt="썸네일 미리보기"
                    className="preview-image"
                  />
                ) : null}
              </div>
              <input type="file" onChange={handleFileChange} />
            </div>
          </div>
          <div className="InfoInput">
            <Infobox
              name="방 이름"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="방 이름을 입력하세요"
            />
            <Infobox
              name="최대 인원"
              value={roomMaxPerson}
              onChange={(e) => setRoomMaxPerson(e.target.value)}
              placeholder="숫자만 입력하세요"
            />
            <Infobox
              name="방 만료일"
              value={roomEndDate}
              onChange={(e) => setRoomEndDate(e.target.value)}
              placeholder="ex) XXXX-XX-XX"
            />
            {/* <Infobox name="BGM 목록" /> */}
          </div>
        </div>
        <div className="DetailInfo">
          <h1 className="DetailInfoTitle">스터디 한 줄 소개</h1>
          <input
            className="DetailInfoInput"
            type="textarea"
            placeholder="스터디에 관한 간단한 설명을 입력하세요"
            value={roomContent}
            onChange={(e) => setRoomContent(e.target.value)}
          />
        </div>
        <div className="btn">
          <button className="create-btn" onClick={handleSubmit}>
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyCreate;
