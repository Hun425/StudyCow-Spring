import "./styles/StudyList.css";
import StudyRoomItem from "./StudyRoomItem";
import { Link } from "react-router-dom";
import useStudyStore from "../../stores/study";
import { useEffect } from "react";

const StudyList = () => {
  const { rooms, recentRoom, fetchRooms, fetchRecentRoom } = useStudyStore(
    (state) => ({
      rooms: state.rooms,
      recentRoom: state.recentRoom,
      fetchRooms: state.fetchRooms,
      fetchRecentRoom: state.fetchRecentRoom,
    })
  );

  useEffect(() => {
    fetchRooms();
    fetchRecentRoom();
  }, [fetchRooms, fetchRecentRoom]);

  return (
    <div className="studyListContainer">
      <Link to="/study/create">
        <button className="studyCreateBtn">방 생성</button>
      </Link>
      <div>
        <p className="rankTitle">누적 공부시간 랭킹</p>
        <div className="rankChange"></div>
        <div className="myRank"></div>
      </div>
      <div className="recentStudyRoom">
        <p className="recentEnterTitle">최근 입장한 스터디룸</p>
        <StudyRoomItem
          roomId={recentRoom.id}
          title={recentRoom.roomTitle}
          thumb={recentRoom.roomThumb}
          maxPerson={recentRoom.roomMaxPerson}
          nowPerson={recentRoom.roomNowPerson}
        />
      </div>
      <div className="studyRoomList">
        <p className="studyListTitle">스터디룸 목록</p>
        <div className="studyRoomGrid">
          {rooms.map((room) => (
            <StudyRoomItem
              key={room.id}
              roomId={room.id}
              title={room.title}
              thumb={room.thumb}
              maxPerson={room.maxPerson}
              nowPerson={room.nowPerson}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyList;
