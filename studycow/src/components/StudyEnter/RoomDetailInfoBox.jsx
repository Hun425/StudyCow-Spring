import "./styles/RoomDetailInfoBox.css";

const RoomDetailInfoBox = ({ name, value }) => {
  return (
    <div className="roomDetailInfoItem">
      <h2>{name}</h2>
      <p>{value}</p>
    </div>
  );
};

export default RoomDetailInfoBox;
