import React from "react";
import './styles/Navbutton.css'

function Navbutton( {image, onButtonClick}) {
  return (
    <button className="NavButtonContainer" onClick={onButtonClick}>
      <img className="NavButtonImg" src={image} alt="버튼이미지" />
    </button>
  );
}
export default Navbutton;
