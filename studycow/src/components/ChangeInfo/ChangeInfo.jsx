/*회원 정보 수정 전체 컴포넌트*/

import React, { useState } from "react";
import ChangeMyInfo from "./ChangeMyInfo"; /*이메일과 닉네임 프로필 변경*/

import "./Styles/ChangeInfo.css";

const ChangeInfo = () => {

  return (
    <div className="ChangeInfo-full-page-container">
      <div className="ChangeInfo-container">
            <ChangeMyInfo />
        </div>
      </div>
  );
};

export default ChangeInfo;
