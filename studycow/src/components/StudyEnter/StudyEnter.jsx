import "./styles/StudyEnter.css";
import { useEffect } from "react";
import RoomDetailInfoBox from "./RoomDetailInfoBox";
import { useNavigate } from 'react-router-dom';
import useStudyStore from "../../stores/study";
import Webcam from "react-webcam";

const StudyEnter = ({ roomId, onRequestClose }) => {
  const { roomDetailInfo, fetchRoomDetailInfo, registerRoom } = useStudyStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomDetailInfo(roomId);
  }, [roomId, fetchRoomDetailInfo]);


  const handleClick = () => {
    // registerRoom 함수를 호출
    registerRoom(roomId);
    // 라우팅
    navigate(`room/${roomId}`);
  };


  return (
    <div>
      <button className="closeButton" onClick={onRequestClose}>
        X
      </button>
      <div className="studyEnterPageContainer">
        <div className="studyEnterPageHeader">
          <div className="roomDetailInfoListUpside">
            <RoomDetailInfoBox
              name="방 이름"
              value={roomDetailInfo.roomTitle}
            />
            <RoomDetailInfoBox
              name="인원 제한"
              value={roomDetailInfo.roomMaxPerson}
            />
          </div>
          <div className="roomDetailInfoListDownside">
            <RoomDetailInfoBox
              name="방 생성일"
              value={roomDetailInfo.roomCreateDate}
            />
            <RoomDetailInfoBox
              name="방 만료일"
              value={roomDetailInfo.roomEndDate}
            />
          </div>
        </div>
        <div className="studyEnterPageBody">
          <div className="roomDetailInfoContent">
            <h2>방 설명</h2>
            <p>{roomDetailInfo.roomContent}</p>
          </div>
          <div className="cameraTestArea">
            <h2>카메라 테스트</h2>
            <Webcam
              className="roomWebcamTest"
              audio={false}
              videoConstraints={{ width: 450, height: 280, facingMode: "user" }}
            />
          </div>
        </div>
        <button className="enterRoomPageBtn" onClick={handleClick}>입장하기</button>
      </div>
    </div>
  );
};

export default StudyEnter;