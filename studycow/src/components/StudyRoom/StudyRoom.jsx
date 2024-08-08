import React, { useEffect } from "react";
import RoomNav from './RoomNav.jsx';
import RoomSidebar from "./RoomSidebar.jsx";
import RoomChat from "./RoomChat.jsx";
import RoomCam from "./RoomCam";
import RoomPlanner from "./RoomPlanner.jsx";
import "./styles/StudyRoom.css";
import useStudyStore from "../../stores/study.js";
import { useParams } from "react-router-dom";
import StudyRoomLeaderBoard from "./StudyRoomLeaderBoard.jsx";

function StudyRoom() {
  const { showChat, showList, showLank, registerRoom } = useStudyStore();

  // URL에서 roomId 추출
  const { roomId } = useParams();

  useEffect(() => {
    console.log(roomId)
        // 컴포넌트가 마운트될 때 registerRoom 함수 호출
    const fetchData = async () => {
      await registerRoom(roomId);
    };

    fetchData();
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때만 실행되도록 합니다

  return (
    <>
      <div className="studyRoomHeader">
        <RoomNav />
      </div>
      <div className="studyRoomMain">
        <div className="studyRoomSidebar">
          <RoomSidebar />
        </div>
        <div className={`studyRoomCamContainer ${showList || showLank || showChat ? 'shifted' : ''}`}>
          <RoomCam roomId={roomId} />
        </div>
        {(showList || showLank || showChat) && (
          <div className="studyRoomUtil">
            {showList && (
              <div className="studyRoomUtilItem">
                <RoomPlanner />
              </div>
            )}
            {showLank && (
              <div className="studyRoomUtilItem">
                <StudyRoomLeaderBoard />
              </div>
            )}
            {showChat && (
              <div className="studyRoomUtilItem">
                <RoomChat roomId={roomId} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StudyRoom;
