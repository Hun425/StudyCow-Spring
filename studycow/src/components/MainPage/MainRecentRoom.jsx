import "./styles/MainRecentRoom.css";
import { useEffect } from "react";
import useStudyStore from "../../stores/study";
import RecentRoomItem from "./RecentRoomItem";

const MainRecentRoom = () => {
  const { recentRoom, fetchRecentRoom } = useStudyStore((state) => ({
    recentRoom: state.recentRoom,
    fetchRecentRoom: state.fetchRecentRoom,
  }));

  useEffect(() => {
    fetchRecentRoom();
  }, [fetchRecentRoom]);

  if (!recentRoom) {
    return (
      <div className="recentRoomIsNone">
        <p>최근 입장한 방이 없소!</p>
      </div>
    );
  }

  return (
    <div className="mainRecentRoomContainer">
      <div>
        <h3>최근 입장한 방</h3>
        <RecentRoomItem
          roomId={recentRoom.id}
          title={recentRoom.roomTitle}
          thumb={recentRoom.roomThumb}
          maxPerson={recentRoom.roomMaxPerson}
          nowPerson={recentRoom.roomNowPerson}
          content={recentRoom.roomContent}
        />
      </div>
    </div>
  );
};

export default MainRecentRoom;
