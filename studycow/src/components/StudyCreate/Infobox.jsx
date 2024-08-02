import "./styles/Infobox.css";

const Infobox = ({ name, value, onChange, placeholder }) => {
  return (
    <div className="whole">
      <div className="title">
        <p className="titleName">{name}</p>
      </div>
      <input
        className="content"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Infobox;
