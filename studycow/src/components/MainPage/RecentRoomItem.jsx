import "./styles/RecentRoomItem.css";
import { useState } from "react";
import StudyEnterModal from "../StudyEnter/StudyEnterModal";
import defaultRoomImg from "../../assets/defaultRoomImage.jpeg"

const RecentRoomItem = ({
  roomId,
  title,
  thumb,
  maxPerson,
  nowPerson,
  content,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="recentRoomContainer"
      style={{ backgroundImage: `url(${thumb || defaultRoomImg})` }}
    >
      <div className="mainRecentRoomInfo">
        <p className="recentRoomTitle">{title}</p>
        <div className="mainRecentRoomInfoDetail">
          <p className="recentRoomCount1">현재 인원: {nowPerson}</p>
          <p className="recentRoomCount2">최대 인원: {maxPerson}</p>
          <p className="recentRoomContent">{content}</p>
        </div>
      </div>
      <button className="recentRoomEnterBtn" onClick={openModal}>
        입장하기
      </button>
      <StudyEnterModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        roomId={roomId}
      />
    </div>
  );
};

export default RecentRoomItem;
