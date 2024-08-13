import "./styles/StudyEnter.css";
import { useEffect } from "react";
import RoomDetailInfoBox from "./RoomDetailInfoBox";
import { useNavigate } from 'react-router-dom';
import useStudyStore from "../../stores/study";
import Webcam from "react-webcam";
import Notiflix from 'notiflix';

const StudyEnter = ({ roomId, onRequestClose }) => {
  const { roomDetailInfo, fetchRoomDetailInfo, registerRoom } = useStudyStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomDetailInfo(roomId);
  }, [roomId, fetchRoomDetailInfo]);

  // 마이크 및 카메라 권한 요청 함수
  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      Notiflix.Notify.success('카메라 및 마이크 권한이 허용되었습니다.');
    } catch (error) {
      Notiflix.Notify.failure('카메라 또는 마이크 권한이 거부되었습니다.');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleClick = async () => {
    try {
        const status = await registerRoom(roomId); // 방 입장 함수 호출 및 완료 대기
        
        if (status === 200) {
            // 상태 코드가 200일 때 라우팅
            Notiflix.Notify.success('방 입장에 성공했소!');
            navigate(`/study/room/${roomId}`);
        } else {
            // 상태 코드가 200이 아닐 때 /study로 리다이렉트
            Notiflix.Notify.failure('방 입장에 실패했소 ㅜㅜ');
            navigate('/study');
        }
    } catch (error) {
      Notiflix.Notify.failure('방 입장에 실패했소 ㅜㅜ');
        navigate('/study'); // 에러 발생 시 /study로 리다이렉트
    }
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
              audio={true}  // 오디오(마이크) 활성화
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
