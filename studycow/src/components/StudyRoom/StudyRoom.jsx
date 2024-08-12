import React, { useState, useEffect, useRef } from "react";
import RoomNav from './RoomNav.jsx';
import RoomSidebar from "./RoomSidebar.jsx";
import RoomChat from "./RoomChat.jsx";
import RoomCam from "./RoomCam";
import RoomPlanner from "./RoomPlanner.jsx";
import "./styles/StudyRoom.css";
import useInfoStore from "../../stores/infos.js";
import useStudyStore from "../../stores/study.js";
import usePlanStore from "../../stores/plan.js";
import { useParams } from "react-router-dom";
import StudyRoomLeaderBoard from "./StudyRoomLeaderBoard.jsx";
import AudioModal from './AudioModal.jsx';
import SettingsModal from './SettingsModal.jsx';

function StudyRoom() {
  const initialLoadRef = useRef(true); // 페이지 로딩 여부를 추적하기 위한 ref
  
  const { showChat, showList, showLank, rankInfo, goStudyBack } = useStudyStore();
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
    // 페이지를 떠나기 전에 goStudyBack을 호출
    const handleBeforeUnload = (event) => {
      goStudyBack();
    };

    // 페이지 로딩 타입을 감지하는 함수
    const checkPageReload = () => {
      const entries = performance.getEntriesByType('navigation');
      if (entries.length > 0 && entries[0].type !== 'reload') {
        goStudyBack();
      }
    };

    // 페이지의 히스토리 상태가 변경될 때 호출되는 함수
    const handlePopState = () => {
      goStudyBack();
    };

    // 페이지 로딩 시에만 checkPageReload 호출
    if (initialLoadRef.current) {
      checkPageReload();
      initialLoadRef.current = false;
    }

    // 페이지를 떠나기 전에 handleBeforeUnload 함수 호출
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 컴포넌트가 언마운트되거나 의존성 배열이 변경될 때 이벤트 리스너 제거
    return () => {
      handlePopState();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [goStudyBack]);

  useEffect(() => {
    const filteredRankInfo = rankInfo.find(
      (rank) => rank.userName === userInfo.userNickName
    );
    setMyRankInfo(filteredRankInfo);
  }, [rankInfo, userInfo]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const { saveDate } = usePlanStore(
    (state) => ({
      saveDate: state.saveDate,
    })
  );

  // 페이지가 로드될 때 date 상태를 항상 오늘 날짜로 설정
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${year}-${month}-${day}`;

    saveDate(formattedToday); // 오늘 날짜로 설정
  }, [saveDate]); // 페이지가 로드될 때마다 실행

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
