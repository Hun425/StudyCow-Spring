import "./styles/StudyRoomItem.css";
import { useNavigate } from "react-router-dom";

const StudyRoomItem = ({ roomId, title, thumb, maxPerson, nowPerson }) => {
  // 이동 - 방 접속
  const navigate = useNavigate();

  const goRoom = (roomNum) => {
    navigate(`/study/room/${roomNum}`);
  }

  return (
    <div
      className="studyRoomContainer"
      style={{ backgroundImage: `url(${thumb})` }}
    >
      <p className="studyRoomTitle">{title}</p>
      <p className="studyRoomCount">
        {nowPerson}/{maxPerson}
      </p>
      <button 
        className="studyRoomEnterBtn" 
        onClick={() => goRoom(roomId)}
      >
        입장하기
      </button>
    </div>
  );
};

export default StudyRoomItem;
