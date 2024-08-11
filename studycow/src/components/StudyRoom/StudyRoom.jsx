import React, { useState, useEffect, useRef } from "react";
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
import AudioModal from './AudioModal.jsx';
import SettingsModal from './SettingsModal.jsx';

function StudyRoom() {
  const { showChat, showList, showLank, rankInfo } = useStudyStore();
  const { userInfo } = useInfoStore();

  const [myRankInfo, setMyRankInfo] = useState(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [micVolume, setMicVolume] = useState(0.5);
  const [bgmOn, setBgmOn] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      window.location.reload();
    };
  }, []);

  useEffect(() => {
    const filteredRankInfo = rankInfo.find(
      (rank) => rank.userName === userInfo.userNickName
    );
    setMyRankInfo(filteredRankInfo);
  }, [rankInfo, userInfo]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (selectedAudio) {
      audioRef.current.src = selectedAudio;
      audioRef.current.loop = true;
      audioRef.current.play();
      setBgmOn(true);
    } else {
      audioRef.current.pause();
      setBgmOn(false);
    }
  }, [selectedAudio]);

  const openAudioModal = () => setIsAudioModalOpen(true);
  const closeAudioModal = () => setIsAudioModalOpen(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  const handleAudioChange = (event) => {
    setSelectedAudio(event.target.value);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleMicVolumeChange = (event, newValue) => {
    setMicVolume(newValue);
  };

  const { roomId } = useParams();

  return (
    <>
      <div className="studyRoomHeader">
        <RoomNav />
      </div>
      <div className="studyRoomMain">
        <div className="studyRoomSidebar">
          <RoomSidebar 
            bgmOn={bgmOn} 
            onOpenAudioModal={openAudioModal} 
            onOpenSettingsModal={openSettingsModal}
          />
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

        {/* 오디오 모달 */}
        <AudioModal 
          open={isAudioModalOpen} 
          onClose={closeAudioModal} 
          selectedAudio={selectedAudio}
          onAudioChange={handleAudioChange}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />

        {/* 설정 모달 */}
        <SettingsModal 
          open={isSettingsModalOpen}
          onClose={closeSettingsModal}
          volume={volume}
          micVolume={micVolume}
          onVolumeChange={handleVolumeChange}
          onMicVolumeChange={handleMicVolumeChange}
        />
      </div>
    </>
  );
}

export default StudyRoom;
