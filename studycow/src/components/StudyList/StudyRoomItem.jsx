import "./styles/StudyRoomItem.css";

const StudyRoomItem = ({ title, thumb, maxPerson, nowPerson }) => {
  return (
    <div
      className="studyRoomContainer"
      style={{ backgroundImage: `url(${thumb})` }}
    >
      <p className="studyRoomTitle">{title}</p>
      <p className="studyRoomCount">
        {nowPerson}/{maxPerson}
      </p>
      <button className="studyRoomEnterBtn">입장하기</button>
    </div>
  );
};

export default StudyRoomItem;
