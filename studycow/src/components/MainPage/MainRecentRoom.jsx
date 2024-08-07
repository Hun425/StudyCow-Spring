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
    return <div>로딩 중...</div>; // 또는 다른 로딩 상태 표시
  }

  return (
    <div className="mainRecentRoomContainer">
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
  );
};

export default MainRecentRoom;
