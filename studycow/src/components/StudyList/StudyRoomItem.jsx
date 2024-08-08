import "./styles/StudyRoomItem.css";
import { useState } from "react";
import StudyEnterModal from "../StudyEnter/StudyEnterModal";

const StudyRoomItem = ({ roomId, title, thumb, maxPerson, nowPerson }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="studyRoomContainer"
      style={{ backgroundImage: `url(${thumb})` }}
    >
      <p className="studyRoomTitle">{title}</p>
      <p className="studyRoomCount">
        {nowPerson}/{maxPerson}
      </p>
      <button className="openEnterModalBtn" onClick={openModal}>
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

export default StudyRoomItem;
