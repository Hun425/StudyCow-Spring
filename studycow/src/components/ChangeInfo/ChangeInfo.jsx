/*회원 정보 수정 전체 컴포넌트*/

import React, { useState } from "react";
import ChangeMyInfo from "./ChangeMyInfo"; /*이메일과 닉네임 프로필 변경*/
import ChangePassword from "./ChangePassword"; /*사용하지 않음*/
import ChangeButton from "./ChangeButton"; /* 폼 전환 버튼&사용하지 않음*/
import "./Styles/ChangeInfo.css";

const ChangeInfo = () => {
  const [isPasswordChange, setIsPasswordChange] = useState(false);

  const handleButtonClick = () => {
    setIsPasswordChange(true);
  };

  const handleCancelClick = () => {
    setIsPasswordChange(false);
  };

  return (
    <div className="ChangeInfo-full-page-container">
      <div className="ChangeInfo-container">
        {!isPasswordChange && (
          <ChangeButton onButtonClick={handleButtonClick} />
        )}
        <div
          className={`ChangeInfo-form-container ${
            isPasswordChange ? "next-form" : ""
          }`}
        >
          {isPasswordChange ? (
            <ChangePassword onCancelClick={handleCancelClick} />
          ) : (
            <ChangeMyInfo />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeInfo;
