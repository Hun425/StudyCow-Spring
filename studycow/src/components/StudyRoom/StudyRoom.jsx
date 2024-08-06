import React, {useState} from "react";
import RoomNav from './RoomNav.jsx'
import RoomSidebar from "./RoomSidebar.jsx";
import RoomContent from './RoomContent.jsx'
import RoomChat from "./RoomChat.jsx";
import RoomPlanner from "./RoomPlanner.jsx";
import './styles/StudyRoom.css'
import useStudyStore from "../../stores/study.js";
import { useParams } from 'react-router-dom';
import RoomCam from "./RoomCam.jsx";

function StudyRoom() {
  const {showChat, showList, showLank } = useStudyStore();

  // URL에서 roomId 추출
  const { roomId } = useParams();


  return (
    <>
    <div className="studyRoomHeader">
      <RoomNav />
    </div>
    <div className="studyRoomMain">
        <div className="studyRoomSidebar">
            <RoomSidebar />
        </div>
        <div className="studyRoomCamContainer">
          <RoomContent />
        </div>
            <div>
            {showList && (
            <div style={{ position: 'fixed', top: '100px', right: '330px', width: '300px', zIndex: 1000 }}>
              <RoomPlanner />
            </div>
          )}
          {showLank && (
            <div style={{ position: 'fixed', bottom: '370px', right: '20px', width: '300px', zIndex: 1000 }}>
            </div>
          )}
            {showChat && (
            <div style={{ position: 'fixed', bottom: '70px', right: '20px', width: '300px', zIndex: 1000 }}>
              <RoomChat roomId={roomId} />
            </div>
          )}
        </div>
    </div>   
    </>
  );
}
export default StudyRoom;

