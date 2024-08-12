/*비밀번호 변경 폼&미사용*/

import React from "react";
import "./Styles/ChangeInfo.css";

const ChangePassword = ({ setIsPasswordChange }) => {
  return (
    <div className="ChangeInfo-info-form">
      <h2>비밀번호 변경</h2>
      <form>
        <div className="ChangeInfo-form-group">
          <label htmlFor="currentPassword">현재 비밀번호:</label>
          <input type="password" id="currentPassword" name="currentPassword" />
        </div>
        <div className="ChangeInfo-form-group">
          <label htmlFor="newPassword">변경할 비밀번호:</label>
          <input type="password" id="newPassword" name="newPassword" />
        </div>
        <div className="ChangeInfo-form-group">
          <label htmlFor="confirmPassword">비밀번호 재확인:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />
        </div>
        <div className="ChangeInfo-button-group">
          <button type="submit" className="ChangeInfo-submit-button">
            변경
          </button>
          <button
            type="button"
            className="ChangeInfo-cancel-button"
            onClick={() => setIsPasswordChange(false)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
