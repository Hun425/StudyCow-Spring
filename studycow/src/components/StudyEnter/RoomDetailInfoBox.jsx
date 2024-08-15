import "./styles/RoomDetailInfoBox.css";

const RoomDetailInfoBox = ({ name, value }) => {
  return (
    <div className="roomDetailInfoItem">
      <p className="roomDetailInfoSetting">{name}</p>
      <p>{value}</p>
    </div>
  );
};

export default RoomDetailInfoBox;
