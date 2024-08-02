import React from "react";
import './styles/Sidebutton.css'


function Sidebutton({image, onButtonClick}) {
  return (
    <>
    <button className="SideButtonContainer" onClick={onButtonClick}>
      <img className="SideButtonImg" src={image} alt="버튼이미지" />
    </button>
    </>
  );
}
export default Sidebutton;
