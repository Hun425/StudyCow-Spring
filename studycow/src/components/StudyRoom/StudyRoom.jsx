import React, { useState, useEffect } from "react";
import RoomNav from './RoomNav.jsx';
import RoomSidebar from "./RoomSidebar.jsx";
import RoomChat from "./RoomChat.jsx";
import RoomCam from "./RoomCam";
import RoomPlanner from "./RoomPlanner.jsx";
import "./styles/StudyRoom.css";
import useInfoStore from "../../stores/infos.js";
import useStudyStore from "../../stores/study.js";
import { useParams } from "react-router-dom";
import StudyRoomLeaderBoard from "./StudyRoomLeaderBoard.jsx";

function StudyRoom() {
  const { showChat, showList, showLank, rankInfo } = useStudyStore();
  const {userInfo} = useInfoStore();

  const [myRankInfo, setMyRankInfo] = useState(null);

  useEffect(() => {
    const filteredRankInfo = rankInfo.find(
      (rank) => rank.userName === userInfo.userNickName
    );
    console.log(filteredRankInfo)
    setMyRankInfo(filteredRankInfo);
  }, [rankInfo, userInfo]);

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
                <StudyRoomLeaderBoard myRankInfo={myRankInfo} />
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
