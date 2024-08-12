/*안쓰는 비번 변경 폼 전환 버튼임*/

import React from "react";
import "./Styles/ChangeInfo.css";

const ChangeButton = ({ setRightPanelActive, isAnimating }) => {
  return (
    <div
      className={`ChangeInfo-overlay-container2 ${
        isAnimating ? "ChangeInfo-animating" : ""
      }`}
    >
      {/* <button
        className={`ChangeInfo-overlay-button2 ${
          isAnimating ? "ChangeInfo-animate" : ""
        }`}
        onClick={setRightPanelActive}
      >
        비밀번호 변경
      </button> */}
    </div>
  );
};

export default ChangeButton;
