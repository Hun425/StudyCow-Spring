import "./styles/RecentRoomItem.css";
import { useNavigate } from "react-router-dom";

const RecentRoomItem = ({
  roomId,
  title,
  thumb,
  maxPerson,
  nowPerson,
  content,
}) => {
  const navigate = useNavigate();

  const goRoom = (roomNum) => {
    navigate(`/study/room/${roomNum}`);
  };

  return (
    <div
      className="recentRoomContainer"
      style={{ backgroundImage: `url(${thumb})` }}
    >
      <p className="recentRoomTitle">{title}</p>
      <p className="recentRoomCount">
        {nowPerson}/{maxPerson}
      </p>
      <p className="recentRoomContent">{content}</p>
      <button className="recentRoomEnterBtn" onClick={() => goRoom(roomId)}>
        입장하기
      </button>
    </div>
  );
};

export default RecentRoomItem;
